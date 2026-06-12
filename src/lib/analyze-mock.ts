import type { CategoryScore, CritiqueResult, Verdict } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/constants";

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

function pick(seed: number, index: number, options: string[]): string {
  return options[Math.floor(seededRandom(seed, index) * options.length)];
}

export function generateMockCritique(seed: number, fileName: string): CritiqueResult {
  const categories: CategoryScore[] = [
    { key: "visualHierarchy", label: CATEGORY_LABELS.visualHierarchy, score: scoreFor(seed, 1), explanation: "How clearly the eye is guided through the interface.", reasoning: pick(seed, 1, HIERARCHY) },
    { key: "typography", label: CATEGORY_LABELS.typography, score: scoreFor(seed, 2), explanation: "Type scale, readability, and font pairing quality.", reasoning: pick(seed, 2, TYPOGRAPHY) },
    { key: "colorSystem", label: CATEGORY_LABELS.colorSystem, score: scoreFor(seed, 3), explanation: "Palette cohesion, contrast, and semantic color usage.", reasoning: pick(seed, 3, COLOR) },
    { key: "spacingLayout", label: CATEGORY_LABELS.spacingLayout, score: scoreFor(seed, 4), explanation: "Grid discipline, whitespace, and alignment consistency.", reasoning: pick(seed, 4, SPACING) },
    { key: "consistency", label: CATEGORY_LABELS.consistency, score: scoreFor(seed, 5), explanation: "Component patterns and visual language uniformity.", reasoning: pick(seed, 5, CONSISTENCY) },
    { key: "accessibility", label: CATEGORY_LABELS.accessibility, score: scoreFor(seed, 6), explanation: "Contrast ratios, touch targets, and inclusive patterns.", reasoning: pick(seed, 6, ACCESSIBILITY) },
    { key: "ux", label: CATEGORY_LABELS.ux, score: scoreFor(seed, 7), explanation: "Clarity of actions, flow, and cognitive load.", reasoning: pick(seed, 7, UX) },
    { key: "conversionPotential", label: CATEGORY_LABELS.conversionPotential, score: scoreFor(seed, 8), explanation: "CTA prominence, trust signals, and friction reduction.", reasoning: pick(seed, 8, CONVERSION) },
  ];

  const overallScore = Math.round(categories.reduce((s, c) => s + c.score, 0) / categories.length);
  const sorted = [...categories].sort((a, b) => b.score - a.score);

  return {
    overallScore,
    verdict: verdictFromScore(overallScore),
    categories,
    biggestStrength: `${sorted[0].label}: strong execution visible in the design.`,
    biggestWeakness: `${sorted[sorted.length - 1].label}: needs attention before shipping.`,
    improvements: [pick(seed, 10, IMP_A), pick(seed, 11, IMP_B), pick(seed, 12, IMP_C)] as [string, string, string],
    seniorComment: `This design (${fileName}) shows promise. Focus on ${sorted[sorted.length - 1].label.toLowerCase()} before your next review.`,
    analyzedAt: new Date().toISOString(),
  };
}

export function mockCritiqueFromRequest(fileName: string, imageBase64: string): CritiqueResult {
  const seed = hashString(fileName + imageBase64.slice(0, 200));
  return generateMockCritique(seed, fileName);
}

const HIERARCHY = ["Clear focal point with structured layers.", "Primary actions compete with secondary content.", "Logical eye path toward key decisions.", "Some sections feel equally weighted."];
const TYPOGRAPHY = ["Disciplined type scale throughout.", "A few size jumps feel arbitrary.", "Readable body text, weak heading contrast.", "Line-height could be more generous."];
const COLOR = ["Cohesive palette with intentional accents.", "Strong semantic color roles.", "Some pairs may fail WCAG AA.", "Muted tones reduce CTA salience."];
const SPACING = ["Generous whitespace, premium feel.", "Grid alignment is strong overall.", "Inconsistent padding between cards.", "Vertical rhythm breaks in places."];
const CONSISTENCY = ["Unified button and radius patterns.", "Mixed component patterns visible.", "Consistent icon stroke weight.", "Card treatments vary between sections."];
const ACCESSIBILITY = ["Touch targets appear adequate.", "Several elements may be below 44px.", "Color not sole state indicator.", "Focus states not visible in capture."];
const UX = ["Intuitive flow, low decision fatigue.", "Too many competing first-view actions.", "Predictable navigation structure.", "Error paths not visible."];
const CONVERSION = ["Clear value proposition above fold.", "CTA needs stronger visual isolation.", "Trust signals missing from hero.", "Low form friction apparent."];
const IMP_A = ["Establish a strict 8px spacing scale.", "Increase primary CTA contrast 15–20%.", "Reduce first-screen visual weights to one headline, one action."];
const IMP_B = ["Audit text pairs for WCAG AA contrast.", "Define a modular type scale and remove one-offs.", "Add one trust element near the primary CTA."];
const IMP_C = ["Consolidate to three button variants max.", "Separate marketing from functional UI zones.", "Run a 5-second comprehension test with new users."];