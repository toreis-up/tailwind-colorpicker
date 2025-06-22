export const STEP_KEYS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
export const STEP_OPTIONS = [
  { label: "自動", value: "auto" },
  ...STEP_KEYS.map((v) => ({ label: v.toString(), value: v })),
] as StepOption[];
export type StepOption = {
  label: string;
  value: "auto" | number;
};

export type ColorElement = {
  id: number;
  hex: string;
  step: 'auto' | number;
}