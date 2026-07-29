export type ThemeMode = 'theme1' | 'theme2' | 'theme3';

export interface ThemeColors {
  themeMode: ThemeMode;
  themeName: string;
  isDark: boolean;
  bg: string;
  cardBg: string;
  cardActiveBg: string;
  border: string;
  activeBorder: string;
  textPrimary: string;
  textSecondary: string;
  textAccent: string;
  topBarBg: string;
  badgeBg: string;
  inputBg: string;
  modalBg: string;
  statBoxBg: string;
}

// 1테마: 다크 모드 (Glassmorphism Obsidian Dark)
export const theme1Dark: ThemeColors = {
  themeMode: 'theme1',
  themeName: '테마 1',
  isDark: true,
  bg: '#080C14',
  cardBg: 'rgba(20, 28, 44, 0.82)',
  cardActiveBg: 'rgba(16, 185, 129, 0.28)',
  border: 'rgba(255, 255, 255, 0.22)',
  activeBorder: '#30D158',
  textPrimary: '#FFFFFF',
  textSecondary: '#A0AEC0',
  textAccent: '#38BDF8',
  topBarBg: 'rgba(15, 23, 42, 0.8)',
  badgeBg: 'rgba(30, 41, 59, 0.75)',
  inputBg: 'rgba(15, 23, 42, 0.85)',
  modalBg: 'rgba(20, 28, 44, 0.94)',
  statBoxBg: 'rgba(15, 23, 42, 0.7)',
};

// 2테마: 라이트 모드 (High-Contrast Clean White Light)
export const theme2Light: ThemeColors = {
  themeMode: 'theme2',
  themeName: '테마 2',
  isDark: false,
  bg: '#F1F5F9',
  cardBg: '#FFFFFF',
  cardActiveBg: '#E0F2FE',
  border: '#CBD5E1',
  activeBorder: '#0284C7',
  textPrimary: '#0F172A',
  textSecondary: '#334155',
  textAccent: '#0369A1',
  topBarBg: '#FFFFFF',
  badgeBg: '#F1F5F9',
  inputBg: '#FFFFFF',
  modalBg: '#FFFFFF',
  statBoxBg: '#F8FAFC',
};

// 3테마: 네온 모드 (Cyberpunk Neon)
export const theme3Neon: ThemeColors = {
  themeMode: 'theme3',
  themeName: '테마 3',
  isDark: true,
  bg: '#0F051D',
  cardBg: 'rgba(28, 15, 52, 0.88)',
  cardActiveBg: 'rgba(255, 0, 127, 0.32)',
  border: 'rgba(0, 242, 254, 0.45)',
  activeBorder: '#FF007F',
  textPrimary: '#FFFFFF',
  textSecondary: '#D8B4FE',
  textAccent: '#00F2FE',
  topBarBg: 'rgba(20, 8, 40, 0.85)',
  badgeBg: 'rgba(45, 20, 80, 0.8)',
  inputBg: 'rgba(25, 10, 50, 0.9)',
  modalBg: 'rgba(24, 10, 48, 0.96)',
  statBoxBg: 'rgba(20, 8, 40, 0.75)',
};

// 하위 호환 alias
export const darkTheme = theme1Dark;
export const lightTheme = theme2Light;
