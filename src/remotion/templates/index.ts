// Metadata-only barrel — safe to import from Server Components.
// The composition component map lives in `./components` (client-side only).

export type { TemplateDefinition, TemplateMetadata, TemplateId } from './types';
export {
  templateRegistry,
  templateList,
  featuredTemplates,
  otherTemplates,
  DEFAULT_TEMPLATE_ID,
  isTemplateId,
  getTemplateDefinition,
  resolveTemplateOrDefault,
  getTemplateDimensions,
} from './registry';

export {
  templateFieldConfigs,
  getTemplateFields,
  type TemplateFieldDefinition,
  type TemplateFieldType,
} from './templateFields';