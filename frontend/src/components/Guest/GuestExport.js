import { useState, useRef, useEffect } from "react";
import api from "../../utils/api";

const GROUP_COLORS = [
  [255, 230, 235],  // light pink
  [230, 240, 255],  // light blue
  [235, 255, 230],  // light green
  [255, 245, 220],  // light yellow
  [240, 230, 255],  // light purple
  [220, 255, 250],  // light teal
  [255, 235, 220],  // light orange
  [240, 240, 240],  // light gray
];

const GuestExport = ({ filteredGuests, weddingId, weddingInfo, groupBy, groupedGuests }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [sending, setSending] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false); };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const headers = ["#", "Name", "Village", "Mobile", "Tag", "Priority", "Card", "Attended", "Amount", "Payment", "Added"];

  const getGroupedData = () => {
    if (groupBy === "none" || !groupedGuests) return null;
    return groupedGuests();
  };

  const downloadPDF = async () => {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");
    const doc = new jsPDF({ orientation: "landscape" });

    // Wedding header
    doc.setFontSize(16);
    doc.text("Digital Newta Manager - Guest List", 14, 15);
    doc.setFontSize(10);
    if (weddingInfo) {
      doc.text(`${weddingInfo.brideName} & ${weddingInfo.groomName}`, 14, 23);
      doc.text(`Date: ${weddingInfo.date || "—"}  |  Venue: ${weddingInfo.venue || "—"}`, 14, 29);
    }
    doc.setFontSize(9);
    doc.text(`Total Guests: ${filteredGuests.length}`, 14, 36);

    const grouped = getGroupedData();

    if (grouped) {
      let startY = 40;
      let serialNo = 1;
      const groupEntries = Object.entries(grouped);

      groupEntries.forEach(([groupName, guests], groupIndex) => {
        const color = GROUP_COLORS[groupIndex % GROUP_COLORS.length];

        // Group header
        doc.setFontSize(11);
        doc.setFont(undefined, "bold");
        doc.setFillColor(color[0] - 30, color[1] - 30, color[2] - 30);
        doc.rect(14, startY - 4, 268, 8, "F");
        doc.text(`${groupName} (${guests.length})`, 16, startY + 1);
        doc.setFont(undefined, "normal");
        startY += 8;

        const rows = guests.map((g) => [
          serialNo++, g.name, g.village, g.mobileNumber || "—", g.tag, g.priority,
          g.attended ? "Yes" : "No", g.amount || 0, g.paymentType || "—", g.addedOn,
        ]);

        autoTable(doc, {
          head: [headers],
          body: rows,
          startY,
          styles: { fontSize: 8 },
          bodyStyles: { fillColor: color },
          alternateRowStyles: { fillColor: [color[0] - 10, color[1] - 10, color[2] - 10] },
          headStyles: { fillColor: [80, 80, 80], textColor: 255 },
        });

        startY = doc.lastAutoTable.finalY + 10;

        // New page if running low on space
        if (startY > doc.internal.pageSize.height - 30 && groupIndex < groupEntries.length - 1) {
          doc.addPage();
          startY = 15;
        }
      });
    } else {
      const rows = filteredGuests.map((g, i) => [
        i + 1, g.name, g.village, g.mobileNumber || "—", g.tag, g.priority,
        g.cardDistributed ? "Yes" : "No", g.attended ? "Yes" : "No", g.amount || 0, g.paymentType || "—", g.addedOn,
      ]);
      autoTable(doc, { head: [headers], body: rows, startY: 40, styles: { fontSize: 8 } });
    }

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text("Visit: https://digitalnewtamanager.vercel.app/", 14, pageHeight - 10);
      doc.setTextColor(0);
    }

    doc.save(`guest-list-${new Date().toISOString().split("T")[0]}.pdf`);
    setShowMenu(false);
  };

  const formatGuestLine = (g, index) => {
    return `${index}. ${g.name.padEnd(20)} | ${g.village.padEnd(14)} | ${(g.mobileNumber || "N/A").padEnd(12)} | ${(g.tag || "—").padEnd(10)} | P:${g.priority || "—"} | ${g.cardDistributed ? "📬" : "📭"} | ${g.attended ? "Yes" : "No "} | ₹${String(g.amount || 0).padEnd(6)} | ${(g.paymentType || "—").padEnd(8)} | ${g.addedOn || "—"}`;
  };

  const downloadText = () => {
    const grouped = getGroupedData();
    let text = "";
    const header = `#   Name                 | Village        | Mobile       | Tag        | Pri | Att | Amount  | Payment  | Added`;
    const divider = "─".repeat(120);

    if (grouped) {
      let serialNo = 1;
      Object.entries(grouped).forEach(([groupName, guests]) => {
        text += `\n${"═".repeat(120)}\n  ${groupName} (${guests.length})\n${"═".repeat(120)}\n${header}\n${divider}\n`;
        guests.forEach((g) => {
          text += formatGuestLine(g, serialNo++) + "\n";
        });
      });
    } else {
      text = `\n${header}\n${divider}\n` + filteredGuests.map((g, i) => formatGuestLine(g, i + 1)).join("\n");
    }

    const blob = new Blob([`Digital Newta Manager - Guest List\n${"=".repeat(120)}\nTotal Guests: ${filteredGuests.length}\n${text}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `guest-list-${new Date().toISOString().split("T")[0]}.txt`;
    a.click(); URL.revokeObjectURL(url);
    setShowMenu(false);
  };

  const downloadExcel = () => {
    const grouped = getGroupedData();
    let csvRows = [headers.join(",")];

    if (grouped) {
      let serialNo = 1;
      Object.entries(grouped).forEach(([groupName, guests]) => {
        csvRows.push("");
        csvRows.push(`"--- ${groupName} (${guests.length}) ---"`);
        guests.forEach((g) => {
          csvRows.push([
            serialNo++, `"${g.name}"`, `"${g.village}"`, g.mobileNumber || "—", g.tag, g.priority,
            g.attended ? "Yes" : "No", g.amount || 0, g.paymentType || "—", g.addedOn,
          ].join(","));
        });
      });
    } else {
      filteredGuests.forEach((g, i) => {
        csvRows.push([
          i + 1, `"${g.name}"`, `"${g.village}"`, g.mobileNumber || "—", g.tag, g.priority,
          g.cardDistributed ? "Yes" : "No", g.attended ? "Yes" : "No", g.amount || 0, g.paymentType || "—", g.addedOn,
        ].join(","));
      });
    }

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `guest-list-${new Date().toISOString().split("T")[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
    setShowMenu(false);
  };

  const sendEmail = async () => {
    setSending(true);
    try {
      const grouped = getGroupedData();
      let text = "";

      if (grouped) {
        let serialNo = 1;
        Object.entries(grouped).forEach(([groupName, guests]) => {
          text += `\n══ ${groupName} (${guests.length}) ══\n`;
          guests.forEach((g) => {
            text += `${serialNo++}. ${g.name} | ${g.village} | ${g.mobileNumber || "N/A"} | ${g.tag || "—"} | P:${g.priority || "—"} | Card:${g.cardDistributed ? "Yes" : "No"} | ${g.attended ? "Attended" : "Not Attended"} | ₹${g.amount || 0} | ${g.paymentType || "—"} | ${g.addedOn || "—"}\n`;
          });
        });
      } else {
        text = filteredGuests
          .map((g, i) => `${i + 1}. ${g.name} | ${g.village} | ${g.mobileNumber || "N/A"} | ${g.tag || "—"} | P:${g.priority || "—"} | Card:${g.cardDistributed ? "Yes" : "No"} | ${g.attended ? "Attended" : "Not Attended"} | ₹${g.amount || 0} | ${g.paymentType || "—"} | ${g.addedOn || "—"}`)
          .join("\n");
      }

      await api.post("/api/guests/send-email", { weddingId, guestListText: text, totalGuests: filteredGuests.length });
      alert("Guest list sent to your email!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send email");
    } finally {
      setSending(false);
      setShowMenu(false);
    }
  };

  return (
    <div className="export-wrapper" ref={menuRef}>
      <button className="download-pdf-btn" onClick={() => setShowMenu(!showMenu)}>📥 Download</button>
      {showMenu && (
        <div className="export-menu">
          <button onClick={downloadPDF}>📄 PDF</button>
          <button onClick={downloadText}>📝 Text</button>
          <button onClick={downloadExcel}>📊 Excel (CSV)</button>
          <button onClick={sendEmail} disabled={sending}>{sending ? "Sending..." : "✉️ Email"}</button>
        </div>
      )}
    </div>
  );
};

export default GuestExport;
