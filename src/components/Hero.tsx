import { FREE_CRITIQUES_PER_DAY } from "@/lib/constants";
import { Badge } from "./ui/Badge";

interface HeroProps {
  remaining: number;
}

export function Hero({ remaining }: HeroProps) {
  return (
    <section className="mx-auto max-w-2xl text-center">
      <Badge>
        {remaining} free critique{remaining !== 1 ? "s" : ""} today
      </Badge>

      <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl sm:leading-[1.1]">
        Know if your design is actually good before your users do.
      </h1>

      <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
        Upload a design and receive a structured senior-level critique in seconds.
      </p>
    </section>
  );
}