import { PROJECT_PLACEHOLDER_BLOCKS } from '../../constants/project-visuals.ts';
import type { Project } from '../../types/project.ts';

function object(value: unknown, path: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${path} must be an object.`);
  return value as Record<string, unknown>;
}

function text(value: unknown, path: string): asserts value is string {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${path} must be a non-empty string.`);
}

function fields(value: Record<string, unknown>, keys: string[], path: string) {
  for (const key of keys) text(value[key], `${path}.${key}`);
}

function keys(value: Record<string, unknown>, allowed: string[], path: string) {
  for (const key of Object.keys(value)) {
    if (!allowed.includes(key)) throw new Error(`${path}.${key} is not a supported field.`);
  }
}

function list(value: unknown, path: string, nonEmpty = false): unknown[] {
  if (!Array.isArray(value) || (nonEmpty && value.length === 0)) throw new Error(`${path} must be ${nonEmpty ? 'a non-empty' : 'an'} array.`);
  return value;
}

function media(value: unknown, path: string, imageOnly = false) {
  const item = object(value, path);
  if (item.kind === 'image') {
    keys(item, ['kind', 'src', 'alt'], path);
    fields(item, ['src', 'alt'], path);
    const src = item.src as string;
    if (!/^\/(?!\/)[^?#]+$/.test(src) && !/^https:\/\//.test(src)) {
      throw new Error(`${path}.src must be a root-relative public image path or an HTTPS URL.`);
    }
  } else if (!imageOnly && item.kind === 'placeholder') {
    keys(item, ['kind', 'preset'], path);
    if (item.preset !== 'pending' && !Object.hasOwn(PROJECT_PLACEHOLDER_BLOCKS, String(item.preset))) {
      throw new Error(`${path}.preset is not a supported placeholder.`);
    }
  } else throw new Error(`${path}.kind must be ${imageOnly ? 'image' : 'image or placeholder'}.`);
}

function section(value: unknown, path: string) {
  const item = object(value, path);
  switch (item.type) {
    case 'hero':
      keys(item, ['type', 'media', 'callouts'], path);
      media(item.media, `${path}.media`);
      if (item.callouts !== undefined) list(item.callouts, `${path}.callouts`).forEach((value, index) => {
        const at = `${path}.callouts[${index}]`;
        const callout = object(value, at);
        keys(callout, ['top', 'left', 'text'], at);
        fields(callout, ['top', 'left', 'text'], at);
        for (const position of ['top', 'left']) {
          const percentage = String(callout[position]);
          if (!/^\d+(\.\d+)?%$/.test(percentage) || parseFloat(percentage) > 100) {
            throw new Error(`${at}.${position} must be a percentage between 0% and 100%.`);
          }
        }
      });
      break;
    case 'timeline':
      keys(item, ['type', 'stages'], path);
      list(item.stages, `${path}.stages`, true).forEach((value, index) => {
        const at = `${path}.stages[${index}]`;
        const stage = object(value, at);
        keys(stage, ['label', 'title', 'description', 'media'], at);
        fields(stage, ['label', 'title', 'description'], at);
        media(stage.media, `${at}.media`);
      });
      break;
    case 'testimonial':
      keys(item, ['type', 'quote', 'author'], path);
      fields(item, ['quote', 'author'], path);
      break;
    case 'comparison':
      keys(item, ['type', 'before', 'after'], path);
      if ((item.before === undefined) !== (item.after === undefined)) throw new Error(`${path} needs both before and after images, or neither for a placeholder.`);
      if (item.before !== undefined) {
        media(item.before, `${path}.before`, true);
        media(item.after, `${path}.after`, true);
      }
      break;
    default: throw new Error(`${path}.type must be hero, timeline, testimonial, or comparison.`);
  }
}

export function parseProject(value: unknown, path = 'project'): Project {
  const item = object(value, path);
  keys(item, ['slug', 'order', 'name', 'category', 'location', 'duration', 'scope', 'area', 'cover', 'featured', 'status', 'legacyAnchor', 'details'], path);
  fields(item, ['slug', 'name', 'category', 'location', 'duration', 'scope', 'area'], path);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(item.slug))) throw new Error(`${path}.slug must use lowercase letters, numbers, and single hyphens.`);
  if (typeof item.order !== 'number' || !Number.isSafeInteger(item.order) || item.order < 0) throw new Error(`${path}.order must be a non-negative integer.`);
  if (!['commercial', 'residential', 'hospitality'].includes(String(item.category))) throw new Error(`${path}.category must be commercial, residential, or hospitality.`);
  if (item.featured !== undefined && typeof item.featured !== 'boolean') throw new Error(`${path}.featured must be a boolean.`);
  for (const key of ['status', 'legacyAnchor']) if (item[key] !== undefined) text(item[key], `${path}.${key}`);
  media(item.cover, `${path}.cover`);
  if (item.details !== undefined) {
    const details = object(item.details, `${path}.details`);
    keys(details, ['summary', 'stats', 'sections'], `${path}.details`);
    text(details.summary, `${path}.details.summary`);
    list(details.stats, `${path}.details.stats`, true).forEach((value, index) => {
      const at = `${path}.details.stats[${index}]`;
      const stat = object(value, at);
      keys(stat, ['value', 'label'], at);
      fields(stat, ['value', 'label'], at);
    });
    if (details.sections !== undefined) list(details.sections, `${path}.details.sections`).forEach((value, index) => section(value, `${path}.details.sections[${index}]`));
  }
  return item as unknown as Project;
}
