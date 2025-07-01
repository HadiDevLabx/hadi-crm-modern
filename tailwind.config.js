/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary Colors - Deep Blue (#1E3A8A)
        'primary': '#1E3A8A',
        'primary-50': '#EFF6FF',
        'primary-100': '#DBEAFE',
        'primary-200': '#BFDBFE',
        'primary-300': '#93C5FD',
        'primary-400': '#60A5FA',
        'primary-500': '#3B82F6',
        'primary-600': '#1E3A8A',
        'primary-700': '#1E40AF',
        'primary-800': '#1E3A8A',
        'primary-900': '#1E3A8A',
        
        // Secondary Colors - Emerald Green (#10B981)
        'secondary': '#10B981',
        'secondary-50': '#ECFDF5',
        'secondary-100': '#D1FAE5',
        'secondary-200': '#A7F3D0',
        'secondary-300': '#6EE7B7',
        'secondary-400': '#34D399',
        'secondary-500': '#10B981',
        'secondary-600': '#059669',
        'secondary-700': '#047857',
        'secondary-800': '#065F46',
        'secondary-900': '#064E3B',
        
        // Accent Colors - Warm Orange (#F59E0B)
        'accent': '#F59E0B',
        'accent-50': '#FFFBEB',
        'accent-100': '#FEF3C7',
        'accent-200': '#FDE68A',
        'accent-300': '#FCD34D',
        'accent-400': '#FBBF24',
        'accent-500': '#F59E0B',
        'accent-600': '#D97706',
        'accent-700': '#B45309',
        'accent-800': '#92400E',
        'accent-900': '#78350F',
        
        // Background Colors
        'background': '#FAFBFC', // Soft off-white (background) - gray-50
        'surface': '#FFFFFF', // Pure white (surface) - white
        'surface-hover': '#F9FAFB', // Light gray hover - gray-50
        
        // Text Colors
        'text-primary': '#1F2937', // Rich charcoal (text primary) - gray-800
        'text-secondary': '#6B7280', // Balanced gray (text secondary) - gray-500
        'text-tertiary': '#9CA3AF', // Light gray (text tertiary) - gray-400
        'text-inverse': '#FFFFFF', // White text for dark backgrounds - white
        
        // Status Colors
        'success': '#10B981', // Fresh green (success) - emerald-500
        'success-50': '#ECFDF5', // Very light green - emerald-50
        'success-100': '#D1FAE5', // Light green - emerald-100
        'success-600': '#059669', // Darker green - emerald-600
        
        'warning': '#F59E0B', // Amber warning (same as accent) - amber-500
        'warning-50': '#FFFBEB', // Very light amber - amber-50
        'warning-100': '#FEF3C7', // Light amber - amber-100
        'warning-600': '#D97706', // Darker amber - amber-600
        
        'error': '#EF4444', // Clear red (error) - red-500
        'error-50': '#FEF2F2', // Very light red - red-50
        'error-100': '#FEE2E2', // Light red - red-100
        'error-600': '#DC2626', // Darker red - red-600
        
        // Border Colors
        'border': '#E5E7EB', // Light gray border - gray-200
        'border-light': '#F3F4F6', // Very light gray border - gray-100
        'border-dark': '#D1D5DB', // Medium gray border - gray-300
      },
      fontFamily: {
        'heading': ['Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'caption': ['Inter', 'system-ui', 'sans-serif'],
        'data': ['JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '16px' }],
        'sm': ['14px', { lineHeight: '20px' }],
        'base': ['16px', { lineHeight: '24px' }],
        'lg': ['18px', { lineHeight: '28px' }],
        'xl': ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '40px' }],
      },
      fontWeight: {
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
      },
      borderRadius: {
        'sm': '4px',
        'DEFAULT': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'base': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '150': '150ms',
        '300': '300ms',
      },
      zIndex: {
        '1000': '1000',
        '1100': '1100',
        '1200': '1200',
        '1300': '1300',
      },
    },
  },
  plugins: [],
}