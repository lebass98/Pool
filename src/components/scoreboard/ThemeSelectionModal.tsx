import React, { useMemo } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScaleFn, useScale } from '@/constants/layout';
import {
  ThemeColors,
  ThemeMode,
  theme1Dark,
  theme2Light,
  theme3Neon,
} from '@/constants/themeColors';

interface ThemeSelectionModalProps {
  visible: boolean;
  currentThemeMode: ThemeMode;
  theme: ThemeColors;
  onClose: () => void;
  onSelectTheme: (mode: ThemeMode) => void;
}

const THEME_OPTIONS: {
  mode: ThemeMode;
  title: string;
  desc: string;
  themeData: ThemeColors;
  previewBg: string;
  cardPreviewBg: string;
  accentColor: string;
  textColor: string;
}[] = [
  {
    mode: 'theme1',
    title: '테마 1\n(옵시디언 다크)',
    desc: '어두운 환경 및 당구장에서 편안한 눈피로 저감 다크 서리 유리',
    themeData: theme1Dark,
    previewBg: '#080C14',
    cardPreviewBg: '#141C2C',
    accentColor: '#30D158',
    textColor: '#FFFFFF',
  },
  {
    mode: 'theme2',
    title: '테마 2\n(화이트 라이트)',
    desc: '밝은 조명 아래서 선명하고 산뜻한 화이트 아크릴 글래스',
    themeData: theme2Light,
    previewBg: '#E2E8F0',
    cardPreviewBg: '#FFFFFF',
    accentColor: '#03DAC6',
    textColor: '#0F172A',
  },
  {
    mode: 'theme3',
    title: '테마 3\n(사이버 네온)',
    desc: '화려한 딥 퍼플과 시안/핑크 네온 틴트의 사이버펑크 디자인',
    themeData: theme3Neon,
    previewBg: '#0F051D',
    cardPreviewBg: '#1C0F34',
    accentColor: '#FF007F',
    textColor: '#FFFFFF',
  },
];

export const ThemeSelectionModal: React.FC<ThemeSelectionModalProps> = ({
  visible,
  currentThemeMode,
  theme,
  onClose,
  onSelectTheme,
}) => {
  const { s, f, line } = useScale();
  const styles = useMemo(() => createStyles(s, f, line), [s, f, line]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalCard,
            { backgroundColor: theme.modalBg, borderColor: theme.border },
          ]}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
              🎨 테마 선택 (Theme Select)
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={[styles.closeBtnText, { color: theme.textSecondary }]}>
                ✕
              </Text>
            </TouchableOpacity>
          </View>

          {/* Theme Option Cards */}
          <View style={styles.optionsGrid}>
            {THEME_OPTIONS.map((opt) => {
              const isSelected = currentThemeMode === opt.mode;

              return (
                <TouchableOpacity
                  key={opt.mode}
                  style={[
                    styles.themeCard,
                    {
                      backgroundColor: opt.previewBg,
                      borderColor: isSelected ? opt.accentColor : 'rgba(255, 255, 255, 0.15)',
                    },
                    isSelected && styles.selectedThemeCard,
                  ]}
                  onPress={() => {
                    onSelectTheme(opt.mode);
                    onClose();
                  }}
                  activeOpacity={0.85}
                >
                  {/* Selected Badge */}
                  {isSelected && (
                    <View
                      style={[
                        styles.activeBadge,
                        { backgroundColor: opt.accentColor },
                      ]}
                    >
                      <Text style={styles.activeBadgeText}>✓ 적용 중</Text>
                    </View>
                  )}

                  {/* UI Mini Preview Mockup */}
                  <View style={styles.previewMockupBox}>
                    <View
                      style={[
                        styles.mockupHeader,
                        { backgroundColor: opt.cardPreviewBg },
                      ]}
                    >
                      <View
                        style={[
                          styles.mockupBadge,
                          { backgroundColor: opt.accentColor },
                        ]}
                      />
                      <View
                        style={[
                          styles.mockupLineShort,
                          { backgroundColor: opt.textColor, opacity: 0.6 },
                        ]}
                      />
                    </View>

                    {/* Mini Score Digits */}
                    <View style={styles.mockupScoreRow}>
                      <View
                        style={[
                          styles.mockupDigit,
                          { backgroundColor: '#1C1C1E', borderColor: opt.accentColor },
                        ]}
                      >
                        <Text style={[styles.mockupDigitText, { color: opt.accentColor }]}>
                          2
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.mockupDigit,
                          { backgroundColor: '#1C1C1E', borderColor: opt.accentColor },
                        ]}
                      >
                        <Text style={[styles.mockupDigitText, { color: opt.accentColor }]}>
                          0
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Theme Info */}
                  <Text style={[styles.themeTitle, { color: opt.textColor }]}>
                    {opt.title}
                  </Text>
                  <Text
                    style={[
                      styles.themeDesc,
                      { color: opt.textColor, opacity: 0.75 },
                    ]}
                  >
                    {opt.desc}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (s: ScaleFn, f: ScaleFn, line: ScaleFn) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.82)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: s(20),
    },
    modalCard: {
      width: '95%',
      maxWidth: s(1400),
      height: '80%',
      maxHeight: s(820),
      borderRadius: s(36),
      padding: s(40),
      borderWidth: line(3),
      justifyContent: 'space-between',
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: s(16),
    },
    modalTitle: {
      fontSize: f(28),
      fontWeight: '900',
    },
    closeBtn: {
      padding: s(8),
    },
    closeBtnText: {
      fontSize: f(26),
      fontWeight: '800',
    },
    optionsGrid: {
      flex: 1,
      flexDirection: 'row',
      gap: s(32),
    },
    themeCard: {
      flex: 1,
      borderRadius: s(28),
      padding: s(42),
      borderWidth: line(2.5),
      position: 'relative',
      justifyContent: 'space-between',
      height: '100%',
    },
    selectedThemeCard: {
      shadowColor: '#00F2FE',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.65,
      shadowRadius: 24,
      elevation: 14,
    },
    activeBadge: {
      position: 'absolute',
      top: s(20),
      right: s(20),
      paddingHorizontal: s(16),
      paddingVertical: s(8),
      borderRadius: s(14),
      zIndex: 10,
    },
    activeBadgeText: {
      color: '#000000',
      fontSize: f(13),
      fontWeight: '900',
    },
    previewMockupBox: {
      flex: 1,
      borderRadius: s(22),
      padding: s(28),
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      marginBottom: s(24),
      justifyContent: 'center',
    },
    mockupHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s(10),
      borderRadius: s(12),
      padding: s(14),
      marginBottom: s(20),
    },
    mockupBadge: {
      width: s(20),
      height: s(20),
      borderRadius: s(10),
    },
    mockupLineShort: {
      width: s(100),
      height: s(10),
      borderRadius: s(5),
    },
    mockupScoreRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: s(16),
    },
    mockupDigit: {
      width: s(58),
      height: s(78),
      borderRadius: s(12),
      borderWidth: line(1.5),
      alignItems: 'center',
      justifyContent: 'center',
    },
    mockupDigitText: {
      fontSize: f(36),
      fontWeight: '900',
    },
    themeTitle: {
      fontSize: f(22),
      fontWeight: '900',
      marginBottom: s(8),
    },
    themeDesc: {
      fontSize: f(14),
      lineHeight: f(22),
      fontWeight: '600',
    },
  });
