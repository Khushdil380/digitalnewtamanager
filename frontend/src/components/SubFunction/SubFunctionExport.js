import { useState, useRef, useEffect } from "react";
import "../../styles/subFunction/SubFunctionExport.css";

const SubFunctionExport = ({ guests, invitedSet, attendedSet, functionName, weddingInfo }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false); };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const invitedGuests = guests.filter((g) => invitedSet.has(g._id));

  const downloadPDF = async () => {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text(`${functionName} - Guest List`, 14, 15);
    doc.setFontSize(10);
    if (weddingInfo) doc.text(`${weddingInfo.brideName} & ${weddingInfo.groomName}`, 14, 23);
    doc.text(`Invited: ${invitedGuests.length} | Attended: ${attendedSet.size}`, 14, 30);

    const rows = invitedGuests.map((g, i) => [
      i + 1, g.name, g.village, attendedSet.has(g._id) ? "Attended" : "Invited",
    ]);

    autoTable(doc, {
      head: [["#", "Name", "Village", "Status"]],
      body: rows,
      startY: 36,
      styles: { fontSize: 9 },
    });

    doc.save(`${functionName}-guests.pdf`);
    setShowMenu(false);
  };

  const downloadText = () => {
    let text = `${functionName} - Guest List\n`;
    if (weddingInfo) text += `${weddingInfo.brideName} & ${weddingInfo.groomName}\n`;
    text += `Invited: ${invitedGuests.length} | Attended: ${attendedSet.size}\n${"─".repeat(60)}\n`;
    text += invitedGuests.map((g, i) =>
      `${i + 1}. ${g.name.padEnd(20)} | ${g.village.padEnd(14)} | ${attendedSet.has(g._id) ? "Attended" : "Invited"}`
    ).join("\n");

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `${functionName}-guests.txt`;
    a.click(); URL.revokeObjectURL(url);
    setShowMenu(false);
  };

  const downloadCSV = () => {
    const rows = [["#", "Name", "Village", "Status"].join(",")];
    invitedGuests.forEach((g, i) => {
      rows.push([i + 1, `"${g.name}"`, `"${g.village}"`, attendedSet.has(g._id) ? "Attended" : "Invited"].join(","));
    });

    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `${functionName}-guests.csv`;
    a.click(); URL.revokeObjectURL(url);
    setShowMenu(false);
  };

  return (
    <div className="sf-export-wrapper" ref={menuRef}>
      <button className="sf-export-btn" onClick={() => setShowMenu(!showMenu)} title="Export">📥</button>
      {showMenu && (
        <div className="sf-export-menu">
          <button onClick={downloadPDF}>📄 PDF</button>
          <button onClick={downloadText}>📝 Text</button>
          <button onClick={downloadCSV}>📊 CSV</button>
        </div>
      )}
    </div>
  );
};

export default SubFunctionExport;
