/**
 * Converts a string to snake_case
 * Works with camelCase, PascalCase, kebab-case, and space-separated strings
 * 
 * @param str The string to convert to snake_case
 * @returns The snake_case version of the string
 */
export function toSnakeCase(str: string): string {
  if (!str) return '';
  
  return str
    // Insert underscore before capital letters in camelCase or PascalCase
    .replace(/([A-Z])/g, '_$1')
    // Replace spaces and hyphens with underscores
    .replace(/[\s-]+/g, '_')
    // Remove any non-alphanumeric characters except underscores
    .replace(/[^a-zA-Z0-9_]/g, '')
    // Convert to lowercase
    .toLowerCase()
    // Remove leading underscore if it exists
    .replace(/^_/, '');
} 