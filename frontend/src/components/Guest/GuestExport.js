import { useState, useRef, useEffect } from "react";
import api from "../../utils/api";

const GuestExport = ({ filteredGuests, weddingId }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [sending, setSending] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false); };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const getRows = () => filteredGuests.map((g, i) => [
    i + 1, g.name, g.village, g.mobileNumber || "—", g.tag, g.priority,
    g.attended ? "Yes" : "No", g.amount || 0, g.paymentType || "—", g.addedOn,
  ]);

  const headers = ["#", "Name", "Village", "Mobile", "Tag", "Priority", "Attended", "Amount", "Payment", "Added"];

  const downloadPDF = async () => {
    const { default: jsPDF } = await import("jspdf");
    await import("jspdf-autotable");
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(14);
    doc.text("Digital Newta Manager - Guest List", 14, 15);
    doc.setFontSize(9);
    doc.text(`Total: ${filteredGuests.length} guests`, 14, 22);
    doc.autoTable({ head: [headers], body: getRows(), startY: 26, styles: { fontSize: 8 } });
    doc.save(`guest-list-${new Date().toISOString().split("T")[0]}.pdf`);
    setShowMenu(false);
  };

  const downloadText = () => {
    const text = filteredGuests
      .map((g, i) => `${i + 1}. ${g.name.padEnd(22)} | ${g.village.padEnd(15)} | ${g.mobileNumber || "N/A"} | ${g.tag} | ₹${g.amount || 0}`)
      .join("\n");
    const blob = new Blob([`Digital Newta Manager - Guest List\n${"=".repeat(60)}\n\n${text}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `guest-list-${new Date().toISOString().split("T")[0]}.txt`;
    a.click(); URL.revokeObjectURL(url);
    setShowMenu(false);
  };

  const downloadExcel = () => {
    const csv = [headers.join(","), ...getRows().map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `guest-list-${new Date().toISOString().split("T")[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
    setShowMenu(false);
  };

  const sendEmail = async () => {
    setSending(true);
    try {
      const text = filteredGuests
        .map((g, i) => `${i + 1}. ${g.name} | ${g.village} | ${g.mobileNumber || "N/A"} | ${g.tag} | ₹${g.amount || 0}`)
        .join("\n");
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
