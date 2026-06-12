import type { AnalyzeRequest, CategoryKey, CategoryScore, CritiqueResult, Verdict } from "./types";
import { CATEGORY_LABELS } from "./constants";

/**
 * MVP analysis engine. Replace `generateCritique` body with a real AI API call
 * without changing the CritiqueResult contract or frontend components.
 */
export async function analyzeDesign(request: AnalyzeRequest): Promise<CritiqueResult> {
  // Simulate processing time for realistic UX during MVP
  await new Promise((r) => setTimeout(r, 100));

  const seed = hashString(request.fileName + request.imageBase64.slice(0, 200));
  return generateCritique(seed, request.fileName);
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number, index: number): number {
  const x = Math.sin(seed * 9999 + index * 12345) * 10000;
  return x - Math.floor(x);
}

function scoreFor(seed: number, index: number): number {
  return Math.round(52 + seededRandom(seed, index) * 44);
}

function verdictFromScore(score: number): Verdict {
  if (score >= 75) return "PASS";
  if (score >= 55) return "NEEDS WORK";
  return "FAIL";
}

function generateCritique(seed: number, fileName: string): CritiqueResult {
  const categories: CategoryScore[] = [
    {
      key: "visualHierarchy",
      label: CATEGORY_LABELS.visualHierarchy,
      score: scoreFor(seed, 1),
      explanation: "How clearly the eye is guided through the interface.",
      reasoning: pick(seed, 1, HIERARCHY_REASONS),
    },
    {
      key: "typography",
      label: CATEGORY_LABELS.typography,
      score: scoreFor(seed, 2),
      explanation: "Type scale, readability, and font pairing quality.",
      reasoning: pick(seed, 2, TYPOGRAPHY_REASONS),
    },
    {
      key: "colorSystem",
      label: CATEGORY_LABELS.colorSystem,
      score: scoreFor(seed, 3),
      explanation: "Palette cohesion, contrast, and semantic color usage.",
      reasoning: pick(seed, 3, COLOR_REASONS),
    },
    {
      key: "spacingLayout",
      label: CATEGORY_LABELS.spacingLayout,
      score: scoreFor(seed, 4),
      explanation: "Grid discipline, whitespace, and alignment consistency.",
      reasoning: pick(seed, 4, SPACING_REASONS),
    },
    {
      key: "consistency",
      label: CATEGORY_LABELS.consistency,
      score: scoreFor(seed, 5),
      explanation: "Component patterns and visual language uniformity.",
      reasoning: pick(seed, 5, CONSISTENCY_REASONS),
    },
    {
      key: "accessibility",
      label: CATEGORY_LABELS.accessibility,
      score: scoreFor(seed, 6),
      explanation: "Contrast ratios, touch targets, and inclusive patterns.",
      reasoning: pick(seed, 6, ACCESSIBILITY_REASONS),
    },
    {
      key: "ux",
      label: CATEGORY_LABELS.ux,
      score: scoreFor(seed, 7),
      explanation: "Clarity of actions, flow, and cognitive load.",
      reasoning: pick(seed, 7, UX_REASONS),
    },
    {
      key: "conversionPotential",
      label: CATEGORY_LABELS.conversionPotential,
      score: scoreFor(seed, 8),
      explanation: "CTA prominence, trust signals, and friction reduction.",
      reasoning: pick(seed, 8, CONVERSION_REASONS),
    },
  ];

  const overallScore = Math.round(
    categories.reduce((sum, c) => sum + c.score, 0) / categories.length
  );

  const sorted = [...categories].sort((a, b) => b.score - a.score);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  return {
    overallScore,
    verdict: verdictFromScore(overallScore),
    categories,
    biggestStrength: `${strongest.label}: ${strengthFromScore(strongest.score)}`,
    biggestWeakness: `${weakest.label}: ${weaknessFromScore(weakest.score)}`,
    improvements: [
      pick(seed, 10, IMPROVEMENTS_A),
      pick(seed, 11, IMPROVEMENTS_B),
      pick(seed, 12, IMPROVEMENTS_C),
    ],
    seniorComment: buildSeniorComment(overallScore, fileName, weakest.key),
    analyzedAt: new Date().toISOString(),
  };
}

function pick(seed: number, index: number, options: string[]): string {
  return options[Math.floor(seededRandom(seed, index) * options.length)];
}

function strengthFromScore(score: number): string {
  if (score >= 80) return "executed with confidence and clear intent";
  if (score >= 65) return "solid foundation with room to polish";
  return "shows deliberate effort in this area";
}

function weaknessFromScore(score: number): string {
  if (score < 55) return "needs significant rework before ship";
  if (score < 70) return "inconsistent execution holding the design back";
  return "minor gaps that compound at scale";
}

function buildSeniorComment(score: number, fileName: string, weakestKey: CategoryKey): string {
  const area = CATEGORY_LABELS[weakestKey];
  if (score >= 75) {
    return `This design (${fileName}) is close to production-ready. The overall craft is strong — tighten ${area.toLowerCase()} and run a quick usability test before launch.`;
  }
  if (score >= 55) {
    return `There's real potential here, but I wouldn't ship yet. Focus a sprint on ${area.toLowerCase()} — it's the bottleneck between "looks good" and "works well."`;
  }
  return `This needs another design pass. ${area} is the primary blocker. Step back, simplify the layout, and rebuild with a clearer hierarchy before showing users.`;
}

const HIERARCHY_REASONS = [
  "Primary actions are visible but secondary content competes for attention.",
  "Clear focal point with well-structured information layers.",
  "Headlines establish priority, though some sections feel equally weighted.",
  "The eye path is logical, guiding users toward key decisions naturally.",
];

const TYPOGRAPHY_REASONS = [
  "Type scale is mostly consistent; a few size jumps feel arbitrary.",
  "Excellent readability with a disciplined modular scale.",
  "Body text is comfortable, but heading weights lack contrast.",
  "Font pairing works, though line-height could be more generous in dense areas.",
];

const COLOR_REASONS = [
  "Palette is cohesive; accent color usage could be more intentional.",
  "Strong semantic color system with clear primary and neutral roles.",
  "Some text-background pairs may fail WCAG AA in lighter sections.",
  "Muted tones create elegance but reduce CTA salience in places.",
];

const SPACING_REASONS = [
  "Grid alignment is strong; vertical rhythm breaks in the footer area.",
  "Generous whitespace creates a premium, breathable layout.",
  "Inconsistent padding between cards suggests missing spacing tokens.",
  "Layout density is appropriate for the content type shown.",
];

const CONSISTENCY_REASONS = [
  "Button styles and border radii are mostly unified across sections.",
  "Mixed component patterns suggest multiple design iterations merged.",
  "Icon style and stroke weight are consistent throughout.",
  "Card treatments vary slightly between sections — define a single pattern.",
];

const ACCESSIBILITY_REASONS = [
  "Touch targets appear adequate; contrast needs verification on muted text.",
  "Several interactive elements may be below 44px minimum touch size.",
  "Color is not the sole indicator of state — good inclusive practice.",
  "Focus states are not visible in this static capture — verify in implementation.",
];

const UX_REASONS = [
  "User flow is intuitive with minimal decision fatigue.",
  "Too many competing actions on first view increases cognitive load.",
  "Navigation structure is predictable and follows common conventions.",
  "Empty states and error paths are not visible in this design.",
];

const CONVERSION_REASONS = [
  "Primary CTA is present but could benefit from stronger visual isolation.",
  "Trust signals and social proof are missing from the hero section.",
  "Clear value proposition above the fold supports conversion intent.",
  "Form friction appears low; consider adding progress indicators for longer flows.",
];

const IMPROVEMENTS_A = [
  "Establish a strict 4px/8px spacing scale and apply it to every component.",
  "Increase primary CTA contrast by 15–20% against the background.",
  "Reduce the number of visual weights on the first screen to one headline, one subline, one action.",
];

const IMPROVEMENTS_B = [
  "Audit all text pairs for WCAG AA contrast — especially muted labels.",
  "Define a type scale (e.g. 12/14/16/20/24/32) and remove one-off font sizes.",
  "Add a single trust element (logo bar, testimonial, or metric) near the primary action.",
];

const IMPROVEMENTS_C = [
  "Consolidate button variants to primary, secondary, and ghost — remove hybrids.",
  "Introduce a clear visual separator between marketing content and functional UI.",
  "Run a 5-second test: can a new user state the page's purpose? Adjust hierarchy if not.",
];