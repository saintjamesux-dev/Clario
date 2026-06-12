export const SUPPORTED_FORMATS = ["image/png", "image/jpeg", "image/jpg", "image/webp"] as const;

export const SUPPORTED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"];

export const MAX_FILE_SIZE_MB = 10;

export const FREE_CRITIQUES_PER_DAY = 10;

export const LOADING_MESSAGES = [
  "Analyzing visual hierarchy...",
  "Evaluating typography...",
  "Reviewing spacing...",
  "Checking accessibility...",
  "Assessing UX...",
  "Calculating final verdict...",
] as const;

export const CATEGORY_LABELS: Record<string, string> = {
  visualHierarchy: "Visual Hierarchy",
  typography: "Typography",
  colorSystem: "Color System",
  spacingLayout: "Spacing & Layout",
  consistency: "Consistency",
  accessibility: "Accessibility",
  ux: "UX",
  conversionPotential: "Conversion Potential",
};

export const DISCLAIMER =
  "Design is opinion. Usability is evidence. Treat this critique as expert guidance, then validate it with real users.";