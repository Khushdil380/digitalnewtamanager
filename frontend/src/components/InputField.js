import React, { useState } from "react";
import "../styles/InputField.css";

const InputField = ({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  error = "",
  required = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="input-field">
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`input-control ${error ? "input-error" : ""} ${isFocused ? "input-focused" : ""}`}
        {...props}
      />
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
};

export default InputField;
