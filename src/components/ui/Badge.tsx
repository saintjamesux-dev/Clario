interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
}

const styles = {
  default: "bg-surface text-muted border-border",
  success: "bg-pass/10 text-pass border-pass/20",
  warning: "bg-warn/10 text-warn border-warn/20",
  danger: "bg-fail/10 text-fail border-fail/20",
};

export function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[variant]}`}
    >
      {children}
    </span>
  );
}