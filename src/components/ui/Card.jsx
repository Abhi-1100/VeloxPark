function Card({ children, badge, className = '', ...props }) {
  return (
    <section
      className={`relative rounded-md border border-line bg-surface p-6 ${className}`}
      {...props}
    >
      {badge && (
        <span className="pointer-events-none absolute right-5 top-4 font-display text-display-md font-extrabold text-gold opacity-20">
          {badge}
        </span>
      )}
      {children}
    </section>
  );
}

export default Card;
