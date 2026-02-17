import { Config } from '../types';

export interface NotationMatch {
  text: string;
  color: string | null;
  isMultiColor?: boolean;
  parts?: { text: string; color: string }[];
}

/**
 * Parse input notation and return color information
 * This handles the complex syntax highlighting rules for GBVSR notation
 */
export const parseInputNotation = (text: string, colors: Config['colors']): NotationMatch[] => {
  const results: NotationMatch[] = [];
  
  // Regular expressions for different notation patterns
  const patterns = {
    // Multi-button with operator (236S+U)
    multiTokenWithOperator: /(\d+S)\+([LMHU])/g,
    
    // Single motion with button (236H, c.M, j.236L, [4]6U, 5S+M, 236S)
    singleToken: /((?:c\.|f\.|j\.)?(?:\[\d+\]|\d+)(?:S(?:\+[LMHU])?|[LMHU]))/g,
    
    // Multi-button combination (M+H, L+M+H)
    multiButton: /([LMHUS])(\+)([LMHUS])(?:(\+)([LMHUS]))?/g,
    
    // Operators
    operators: /[~>+]/g,
    
    // RS (Raging Strike)
    ragingStrike: /\bRS\b/g,
  };

  // This is a simplified version - full implementation would:
  // 1. Tokenize the input string
  // 2. Match against all patterns in priority order
  // 3. Apply colors based on button strength
  // 4. Handle special cases (236S+U, multi-button, etc.)
  
  // For now, return the input as-is
  // TODO: Implement full pattern matching and coloring logic
  results.push({ text, color: null });
  
  return results;
};

/**
 * Get color for a button
 */
export const getButtonColor = (button: string, colors: Config['colors']): string => {
  switch (button.toUpperCase()) {
    case 'L':
      return colors.light;
    case 'M':
      return colors.medium;
    case 'H':
      return colors.heavy;
    case 'U':
      return colors.ultimate;
    case 'S':
      return colors.skill;
    default:
      return '#ffffff';
  }
};

/**
 * Check if a token should be colored
 */
export const shouldColorToken = (token: string): boolean => {
  // Standalone buttons without directionals should NOT be colored
  if (/^[LMHUS]$/.test(token)) {
    return false;
  }
  
  // RS should NOT be colored
  if (token === 'RS') {
    return false;
  }
  
  // Operators should NOT be colored
  if (/^[~>+]$/.test(token)) {
    return false;
  }
  
  return true;
};
