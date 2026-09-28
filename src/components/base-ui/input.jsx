import React, { forwardRef } from 'react';

export const Input = forwardRef(function Input(
  { className = '', type = 'text', disabled = false, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      type={type}
      disabled={disabled}
      className={`w-full text-sm text-paper placeholder:text-muted/60 transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50 [color-scheme:dark] ${className}`}
      {...props}
    />
  );
});

export default Input;
