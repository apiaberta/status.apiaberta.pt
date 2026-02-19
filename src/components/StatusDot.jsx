export default function StatusDot({ status, size = 'md' }) {
  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const colors = {
    up: `bg-green-500 ${size !== 'sm' ? 'pulse-green' : ''}`,
    down: `bg-red-500 ${size !== 'sm' ? 'pulse-red' : ''}`,
    unknown: 'bg-slate-500',
    checking: 'bg-slate-500',
  };

  const s = status || 'unknown';
  const color = colors[s] || colors.unknown;

  return (
    <span
      className={`inline-block rounded-full flex-shrink-0 ${sizes[size]} ${color} status-transition`}
      aria-hidden="true"
    />
  );
}
