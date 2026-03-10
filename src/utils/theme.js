// Theme configuration for light and dark modes
export const themeColors = {
  light: {
    // Backgrounds
    bg: {
      primary: 'bg-white',
      secondary: 'bg-gray-50',
      tertiary: 'bg-gray-100',
      card: 'bg-white',
      hover: 'hover:bg-gray-100',
    },
    // Text
    text: {
      primary: 'text-gray-900',
      secondary: 'text-gray-600',
      tertiary: 'text-gray-500',
      inverse: 'text-white',
    },
    // Borders
    border: {
      primary: 'border-gray-200',
      secondary: 'border-gray-300',
    },
    // Inputs
    input: {
      bg: 'bg-gray-100',
      border: 'border-gray-300',
      text: 'text-gray-900',
      placeholder: 'placeholder-gray-500',
    },
  },
  dark: {
    // Backgrounds
    bg: {
      primary: 'dark:bg-gray-950',
      secondary: 'dark:bg-gray-900',
      tertiary: 'dark:bg-gray-800',
      card: 'dark:bg-gray-900',
      hover: 'dark:hover:bg-gray-800',
    },
    // Text
    text: {
      primary: 'dark:text-white',
      secondary: 'dark:text-gray-300',
      tertiary: 'dark:text-gray-400',
      inverse: 'dark:text-gray-900',
    },
    // Borders
    border: {
      primary: 'dark:border-gray-800',
      secondary: 'dark:border-gray-700',
    },
    // Inputs
    input: {
      bg: 'dark:bg-gray-800',
      border: 'dark:border-gray-700',
      text: 'dark:text-white',
      placeholder: 'dark:placeholder-gray-400',
    },
  },
};

// Helper function to combine light and dark classes
export const theme = (lightClass, darkClass) => `${lightClass} ${darkClass}`;
