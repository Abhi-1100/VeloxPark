import React from 'react';

export function Label({ children, htmlFor, className = '', ...props }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-semibold text-primary block tracking-wide select-none ${className}`}
      {...props}
    >
      {children}
    </label>
  );
}

export default Label;
