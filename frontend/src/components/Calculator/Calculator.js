import React, { useState } from "react";
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

  return (
    <div className="calc-overlay">
      <div className="calc-container">
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
