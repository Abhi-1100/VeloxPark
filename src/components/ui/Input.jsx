function Input({ label, id, className = '', ...props }) {
  return (
    <label htmlFor={id} className="block space-y-2">
      {label && <span className="block font-sans text-label font-bold uppercase text-muted">{label}</span>}
      <input
        id={id}
        className={`min-h-11 w-full rounded-sm border border-line bg-surface-raised px-4 py-3 font-sans text-body text-paper placeholder:text-muted transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 ${className}`}
        {...props}
      />
    </label>
  );
}

export default Input;
