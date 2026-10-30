export const PROJECT_TYPOLOGIES = [
  { value: 'Residential', icon: 'residential' },
  { value: 'Commercial', icon: 'commercial' },
  { value: 'Institutional', icon: 'institutional' },
  { value: 'Villa', icon: 'villa' },
  { value: 'Others', icon: 'others' },
] as const;

export const PROJECT_SCOPES = [
  { value: 'Design Only', description: 'You execute, we design and document.', recommended: false },
  { value: 'Turnkey Execution', description: 'Single-point responsibility, start to handover.', recommended: true },
];

export const PROJECT_TIMELINES = ['< 1 month', '1–3 months', '3–6 months', 'Flexible'];
export const PLANNER_STEPS = [1, 2, 3, 4];
export const DEFAULT_PROJECT_BUDGET = 25;
export const MIN_PROJECT_BUDGET = 5;
export const MAX_PROJECT_BUDGET = 150;
export const PROJECT_BUDGET_STEP = 5;
