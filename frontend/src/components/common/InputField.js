import React from "react";
import "../../styles/common/InputField.css";

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
        className={`input-control ${error ? "input-error" : ""}`}
        {...props}
      />
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
};

export default InputField;
