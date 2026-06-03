import React, { useState, useRef, useCallback } from "react";
import "./Calculator.css";

const BUTTONS = [
  ["C", "±", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "+"],
  ["0", ".", "⌫", "="],
];

const Calculator = ({ onClose }) => {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState(null);
  const [op, setOp] = useState(null);
  const [reset, setReset] = useState(false);

  // Drag state
  const [pos, setPos] = useState({ x: null, y: null });
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseDown = useCallback((e) => {
    if (e.target.closest(".calc-btn") || e.target.closest(".calc-close")) return;
    dragging.current = true;
    const rect = containerRef.current.getBoundingClientRect();
    offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!dragging.current) return;
    setPos({
      x: Math.min(Math.max(0, e.clientX - offset.current.x), window.innerWidth - 230),
      y: Math.min(Math.max(0, e.clientY - offset.current.y), window.innerHeight - 320),
    });
  }, []);

  const handleMouseUp = useCallback(() => { dragging.current = false; }, []);

  // Touch support
  const handleTouchStart = useCallback((e) => {
    if (e.target.closest(".calc-btn") || e.target.closest(".calc-close")) return;
    const t = e.touches[0];
    dragging.current = true;
    const rect = containerRef.current.getBoundingClientRect();
    offset.current = { x: t.clientX - rect.left, y: t.clientY - rect.top };
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!dragging.current) return;
    const t = e.touches[0];
    setPos({
      x: Math.min(Math.max(0, t.clientX - offset.current.x), window.innerWidth - 210),
      y: Math.min(Math.max(0, t.clientY - offset.current.y), window.innerHeight - 320),
    });
    e.preventDefault();
  }, []);

  const handleTouchEnd = useCallback(() => { dragging.current = false; }, []);

  const handleButton = (btn) => {
    if (btn === "C") { setDisplay("0"); setPrev(null); setOp(null); setReset(false); return; }
    if (btn === "⌫") { setDisplay(display.length > 1 ? display.slice(0, -1) : "0"); return; }
    if (btn === "±") { setDisplay(String(parseFloat(display) * -1)); return; }
    if (btn === "%") { setDisplay(String(parseFloat(display) / 100)); return; }

    if (["÷", "×", "−", "+"].includes(btn)) {
      setPrev(parseFloat(display)); setOp(btn); setReset(true); return;
    }

    if (btn === "=") {
      if (prev === null || !op) return;
      const cur = parseFloat(display);
      const ops = { "+": prev + cur, "−": prev - cur, "×": prev * cur, "÷": cur !== 0 ? prev / cur : "Error" };
      const result = ops[op];
      setDisplay(String(parseFloat(Number(result).toFixed(10))));
      setPrev(null); setOp(null); setReset(false);
      return;
    }

    if (btn === "." && display.includes(".") && !reset) return;
    const newVal = reset ? btn : (display === "0" && btn !== "." ? btn : display + btn);
    setDisplay(newVal);
    setReset(false);
  };

  const isOp = (btn) => ["÷", "×", "−", "+"].includes(btn);

  const containerStyle = pos.x !== null
    ? { position: "fixed", left: pos.x, top: pos.y, bottom: "auto", right: "auto" }
    : {};

  return (
    <div
      className="calc-overlay"
      style={containerStyle}
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="calc-container">
        <div className="calc-drag-handle" title="Drag to move">⠿</div>
        <button className="calc-close" onClick={onClose}>✕</button>
        <div className="calc-display">
          {op && <span className="calc-op-indicator">{prev} {op}</span>}
          <span className="calc-value">{display}</span>
        </div>
        <div className="calc-buttons">
          {BUTTONS.flat().map((btn, i) => (
            <button
              key={i}
              className={`calc-btn ${btn === "=" ? "calc-eq" : ""} ${isOp(btn) ? "calc-op" : ""} ${btn === "0" ? "calc-zero" : ""} ${btn === "C" ? "calc-clear" : ""}`}
              onClick={() => handleButton(btn)}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calculator;
