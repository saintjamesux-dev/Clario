import type { Verdict } from "@/lib/types";
import { Badge } from "./ui/Badge";

interface VerdictBadgeProps {
  verdict: Verdict;
}

const config: Record<Verdict, { variant: "success" | "warning" | "danger"; label: string }> = {
  PASS: { variant: "success", label: "PASS" },
  "NEEDS WORK": { variant: "warning", label: "NEEDS WORK" },
  FAIL: { variant: "danger", label: "FAIL" },
};

export function VerdictBadge({ verdict }: VerdictBadgeProps) {
  const { variant, label } = config[verdict];
  return (
    <Badge variant={variant}>
      <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </Badge>
  );
}