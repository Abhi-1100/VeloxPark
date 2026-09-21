const statuses = {
  reserved: { label: 'Reserved', className: 'border-gold text-gold' },
  active: { label: 'Active', className: 'border-available text-available' },
  expired: { label: 'Expired', className: 'border-danger text-danger' },
  completed: { label: 'Completed', className: 'border-info text-info' },
  cancelled: { label: 'Cancelled', className: 'border-muted text-muted' },
};

function StatusPill({ status, className = '' }) {
  const normalizedStatus = String(status).toLowerCase();
  const config = statuses[normalizedStatus] || statuses.expired;

  return (
    <span className={`inline-flex rounded-pill border px-2.5 py-1 font-sans text-label font-bold uppercase ${config.className} ${className}`}>
      {config.label}
    </span>
  );
}

export default StatusPill;
