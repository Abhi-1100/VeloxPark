import React from 'react';

const variantStyles = {
  default: 'bg-primary text-ink font-bold hover:bg-primary/90 focus-visible:ring-primary/40',
  primary: 'bg-primary text-ink font-bold hover:bg-primary/90 focus-visible:ring-primary/40',
  outline: 'border border-border/60 bg-surface/70 text-paper hover:bg-surface-raised hover:border-primary/50 hover:text-paper focus-visible:ring-primary/30',
  secondary: 'bg-surface-raised border border-border text-paper hover:border-primary/60 hover:text-primary focus-visible:ring-primary/30',
  ghost: 'bg-transparent text-paper hover:bg-surface-raised hover:text-primary focus-visible:ring-primary/30',
};

export function Button({
  children,
  className = '',
  variant = 'default',
  type = 'button',
  disabled = false,
  ...props
}) {
  const chosenVariant = variantStyles[variant] || variantStyles.default;

  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 transition-all duration-200 outline-none select-none disabled:pointer-events-none disabled:opacity-50 ${chosenVariant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
