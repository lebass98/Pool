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

// 3테마: 스포츠 그래픽 그래픽카드 모드 (Premier League / Overwatch Challenges Feel)
export const theme3Neon: ThemeColors = {
  themeMode: 'theme3',
  themeName: '테마 3',
  isDark: false,
  bg: '#4BA2E3', // 오버워치 챌린지풍의 청량한 세룰리안 스카이블루 배경
  cardBg: 'rgba(255, 255, 255, 0.85)', // 배경이 부드럽게 투과되는 반투명 흰색 카드
  cardActiveBg: '#00F2C3', // 활성화 턴: 오버워치 완료 챌린지 느낌의 강렬한 네온 민트/시안
  border: 'rgba(255, 255, 255, 0.28)', // 부드러운 화이트 투명 경계선
  activeBorder: '#00E5FF',
  textPrimary: '#0F172A', // 선명한 차콜 텍스트로 가독성 보장
  textSecondary: '#475569',
  textAccent: '#FF9100', // 오버워치 배틀패스 포인트 골드 오렌지색
  topBarBg: 'rgba(255, 255, 255, 0.18)', // 스카이블루 배경에 녹아드는 반투명 헤더 바
  badgeBg: 'rgba(255, 255, 255, 0.28)', // 반투명 화이트 배지 배경
  inputBg: 'rgba(255, 255, 255, 0.85)',
  modalBg: '#FFFFFF',
  statBoxBg: 'rgba(0, 0, 0, 0.05)', // 연한 반투명 블랙 스탯 카드 배경
};

// 하위 호환 alias
export const darkTheme = theme1Dark;
export const lightTheme = theme2Light;
