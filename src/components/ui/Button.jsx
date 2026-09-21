const variants = {
  primary: 'bg-gold text-ink hover:bg-gold focus-visible:ring-gold',
  secondary: 'border border-gold bg-transparent text-gold hover:bg-gold hover:text-ink focus-visible:ring-gold',
  ghost: 'border border-line bg-transparent text-paper hover:border-gold hover:text-gold focus-visible:ring-gold',
};

function Button({ children, className = '', variant = 'primary', type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-3 font-display text-label font-bold uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:cursor-not-allowed disabled:border-line disabled:bg-line disabled:text-muted disabled:hover:bg-line ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
