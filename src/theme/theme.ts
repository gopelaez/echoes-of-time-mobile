export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  accent: string;
  taupe: string; // Taupe/olive color from loading bar
  border: string;
}

export interface ThemeTypography {
  heading: string;
  headingItalic: string;
  body: string;
  monospace: string;
}

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface ThemeBorderRadius {
  sm: number;
  md: number;
  lg: number;
}

export interface Theme {
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
}

// Light theme colors
const lightColors: ThemeColors = {
  primary: '#1a1a2e', // Deep navy
  secondary: '#16213e', // Darker navy
  background: '#f5e9dc', // Soft beige
  surface: '#ffffff', // Pure white
  text: '#1a1a2e', // Deep navy for text
  accent: '#c49b66', // Bronze/gold
  taupe: '#AB9270', // Taupe/olive color
  border: '#e0d5c7', // Light beige border
};

// Dark theme colors
const darkColors: ThemeColors = {
  primary: '#1e2328', // Darker charcoal
  secondary: '#13191F', // Base background color
  background: '#13191F', // New background color
  surface: '#1e2328', // Slightly lighter surface
  text: '#e8e6e3', // Light warm text
  accent: '#AB9270', // Taupe accent
  taupe: '#AB9270', // Taupe/olive color
  border: '#2a2d32', // Subtle border
};

const typography: ThemeTypography = {
  heading: 'Merriweather_700Bold', // Elegant serif for headings
  headingItalic: 'Merriweather_700Bold_Italic', // Elegant serif italic for headings
  body: 'Inter', // Modern sans-serif for body
  monospace: 'Courier New', // Monospace font
};

const spacing: ThemeSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const borderRadius: ThemeBorderRadius = {
  sm: 4,
  md: 8,
  lg: 16,
};

export const lightTheme: Theme = {
  colors: lightColors,
  typography,
  spacing,
  borderRadius,
};

export const darkTheme: Theme = {
  colors: darkColors,
  typography,
  spacing,
  borderRadius,
};

export default lightTheme;
