import { PROJECT_LEAD_LIMITS } from '../../constants/project-lead';
import {
  MAX_PROJECT_BUDGET, MIN_PROJECT_BUDGET, PROJECT_BUDGET_STEP,
  PROJECT_SCOPES, PROJECT_TIMELINES, PROJECT_TYPOLOGIES,
} from '../../constants/project-planner';
import type { ProjectLeadDetails, ProjectLeadErrors } from '../../types/project-lead';

export function validateProjectLead(details: ProjectLeadDetails): ProjectLeadErrors {
  const errors: ProjectLeadErrors = {};
  for (const field of ['name', 'location'] as const) {
    if (details[field].trim().length < 2 || details[field].trim().length > PROJECT_LEAD_LIMITS[field]) {
      errors[field] = field === 'name' ? 'Enter your full name (2–120 characters).' : 'Enter the project area and city (2–200 characters).';
    }
  }
  const phone = details.phone.trim();
  const digits = phone.replace(/\D/g, '');
  if (!/^\+?[\d\s().-]+$/.test(phone) || digits.length < 7 || digits.length > 15 || phone.length > PROJECT_LEAD_LIMITS.phone) {
    errors.phone = 'Enter a valid phone number, including the country code if outside India.';
  }
  const email = details.email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > PROJECT_LEAD_LIMITS.email) {
    errors.email = 'Enter a valid email address.';
  }
  if (!PROJECT_TYPOLOGIES.some((option) => option.value === details.typology)) errors.typology = 'Choose a project type.';
  if (details.typology === 'Other' && (details.typologyOther.trim().length < 2 || details.typologyOther.trim().length > PROJECT_LEAD_LIMITS.typologyOther)) {
    errors.typologyOther = 'Describe your project type (2–200 characters).';
  }
  if (!PROJECT_SCOPES.some((option) => option.value === details.scope)) errors.scope = 'Choose a project scope.';
  if (!PROJECT_TIMELINES.includes(details.timeline)) errors.timeline = 'Choose a timeline.';
  if (!Number.isFinite(details.budget) || details.budget < MIN_PROJECT_BUDGET || details.budget > MAX_PROJECT_BUDGET || details.budget % PROJECT_BUDGET_STEP !== 0) {
    errors.budget = 'Choose a budget between ₹5L and ₹150L in ₹5L steps.';
  }
  for (const field of ['name', 'phone', 'email', 'location', 'typologyOther'] as const) {
    if (/[\u0000-\u001f\u007f]/.test(details[field].trim())) errors[field] = 'Use a single line without control characters.';
  }
  return errors;
}
