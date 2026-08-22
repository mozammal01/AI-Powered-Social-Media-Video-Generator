// Metadata-only barrel — safe to import from Server Components.
// The composition component map lives in `./components` (client-side only).

export type { TemplateDefinition, TemplateMetadata, TemplateId } from './types';
export {
  templateRegistry,
  templateList,
  DEFAULT_TEMPLATE_ID,
  isTemplateId,
  getTemplateDefinition,
  resolveTemplateOrDefault,
  getTemplateDimensions,
} from './registry';