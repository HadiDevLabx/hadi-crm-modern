import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names using clsx and tailwind-merge
 * to ensure proper handling of Tailwind CSS classes
 * 
 * @param {string[]} inputs - Class names to be combined
 * @returns {string} - Merged class string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Utility for creating components with variants using class-variance-authority
 * @param {Object} config - The component configuration object
 * @returns {Function} - A function that accepts variant props and returns class names
 */
export function createVariants(config) {
  return (props) => {
    const { className, ...rest } = props || {};
    const baseClasses = config.base || '';
    const variantClasses = Object.entries(config.variants || {})
      .map(([variantName, variantOptions]) => {
        const value = rest[variantName];
        return value && variantOptions[value];
      })
      .filter(Boolean)
      .join(' ');
      
    const defaultClasses = Object.entries(config.defaultVariants || {})
      .map(([variantName, defaultValue]) => {
        const value = rest[variantName] === undefined ? defaultValue : rest[variantName];
        return value && config.variants[variantName][value];
      })
      .filter(Boolean)
      .join(' ');

    return cn(baseClasses, variantClasses, defaultClasses, className);
  };
}
