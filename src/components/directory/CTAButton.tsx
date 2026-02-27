interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export default function CTAButton({ href, children, variant = 'primary', className = '' }: CTAButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 text-center';
  const styles = variant === 'primary'
    ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-8 py-4 text-lg hover:from-blue-600 hover:to-cyan-500 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40'
    : 'border border-slate-600 text-slate-300 px-6 py-3 hover:bg-slate-800 hover:text-white';

  return (
    <a href={href} className={`${base} ${styles} ${className}`}>
      {children}
    </a>
  );
}
