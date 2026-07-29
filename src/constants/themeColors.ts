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
  cardActiveBg: 'rgba(16, 185, 129, 0.35)', // 선명한 에메랄드 그린 배경 체인지
  border: 'rgba(255, 255, 255, 0.22)',
  activeBorder: 'rgba(255, 255, 255, 0.22)',
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
  cardActiveBg: '#BAE6FD', // 또렷한 스카이 블루 액티브 카드 배경
  border: '#CBD5E1',
  activeBorder: '#CBD5E1',
  textPrimary: '#0F172A',
  textSecondary: '#334155',
  textAccent: '#0369A1',
  topBarBg: '#FFFFFF',
  badgeBg: '#F1F5F9',
  inputBg: '#FFFFFF',
  modalBg: '#FFFFFF',
  statBoxBg: '#F8FAFC',
};

// 3테마: 스포츠 그래픽 그래픽카드 모드 (Premier League / Broadcast Graphics Image Feel)
export const theme3Neon: ThemeColors = {
  themeMode: 'theme3',
  themeName: '테마 3',
  isDark: false,
  bg: '#ECE9F8', // 쿨 라벤더 비주얼 그래픽 모드 배경
  cardBg: '#FFFFFF', // 깨끗한 불투명 그래픽 카드
  cardActiveBg: '#3B82F6', // 활성화 턴: 강렬한 네온 엘렉트릭 블루 그래픽 카드
  border: '#C084FC', // 브로드캐스트 가이드 라인
  activeBorder: '#7C3AED',
  textPrimary: '#0F172A',
  textSecondary: '#4C1D95', // 인텐스 퍼플 헤더 텍스트
  textAccent: '#6D28D9',
  topBarBg: '#FFFFFF',
  badgeBg: '#F3E8FF',
  inputBg: '#FFFFFF',
  modalBg: '#FFFFFF',
  statBoxBg: '#F5F3FF',
};

// 하위 호환 alias
export const darkTheme = theme1Dark;
export const lightTheme = theme2Light;
