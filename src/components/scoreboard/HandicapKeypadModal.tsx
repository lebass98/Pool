import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScaleFn, useScale } from '@/constants/layout';
import { ThemeColors } from '@/constants/themeColors';

interface HandicapKeypadModalProps {
  visible: boolean;
  playerName: string;
  initialValue: number;
  theme: ThemeColors;
  onClose: () => void;
  onConfirm: (value: number) => void;
  onNextPlayer?: () => void;
  hasNextPlayer?: boolean;
}

export const HandicapKeypadModal: React.FC<HandicapKeypadModalProps> = ({
  visible,
  playerName,
  initialValue,
  theme,
  onClose,
  onConfirm,
  onNextPlayer,
  hasNextPlayer = false,
}) => {
  const { s, f, line } = useScale();
  const styles = React.useMemo(() => createStyles(s, f, line, theme), [s, f, line, theme]);
  const [inputValue, setInputValue] = useState<string>('0');

  useEffect(() => {
    if (visible) {
      setInputValue('0');
    }
  }, [visible]);

  const handlePressNumber = (num: number) => {
    let nextStr = '';
    if (inputValue === '0') {
      nextStr = String(num);
    } else if (inputValue.length < 3) {
      nextStr = inputValue + String(num);
    } else {
      return;
    }
    setInputValue(nextStr);
    const val = parseInt(nextStr, 10) || 0;
    onConfirm(val);
  };

  const handleClear = () => {
    let nextStr = '0';
    if (inputValue.length > 1) {
      nextStr = inputValue.slice(0, -1);
    }
    setInputValue(nextStr);
    const val = parseInt(nextStr, 10) || 0;
    onConfirm(val);
  };

  const handleConfirm = () => {
    const val = parseInt(inputValue, 10) || 0;
    onConfirm(val);
    if (hasNextPlayer && onNextPlayer) {
      onNextPlayer();
    } else {
      onClose();
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.backdropTouch} activeOpacity={1} onPress={onClose} />
        
        <View style={styles.keypadOuterFrame}>
          {/* 상단 선수 이름 및 현재 설정 수치 표시창 */}
          <View style={styles.headerDisplay}>
            <Text style={styles.playerTitle} numberOfLines={1}>
              [{playerName}] 선수 목표 점수
            </Text>
            <View style={styles.displayValueRow}>
              <Text style={styles.displayValueText}>{inputValue}</Text>
              <Text style={styles.displayUnitText}>점</Text>
            </View>
          </View>

          {/* 3x4 메탈 다이얼 키패드 그리드 */}
          <View style={styles.grid}>
            {/* 1, 2, 3 */}
            <View style={styles.row}>
              {[1, 2, 3].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={styles.keyBtn}
                  onPress={() => handlePressNumber(num)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.numKeyText}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 4, 5, 6 */}
            <View style={styles.row}>
              {[4, 5, 6].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={styles.keyBtn}
                  onPress={() => handlePressNumber(num)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.numKeyText}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 7, 8, 9 */}
            <View style={styles.row}>
              {[7, 8, 9].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={styles.keyBtn}
                  onPress={() => handlePressNumber(num)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.numKeyText}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 지움, 0, 다음/확인 */}
            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.keyBtn, styles.actionBtn]}
                onPress={handleClear}
                activeOpacity={0.7}
              >
                <Text style={styles.clearBtnText}>지움</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.keyBtn}
                onPress={() => handlePressNumber(0)}
                activeOpacity={0.7}
              >
                <Text style={styles.numKeyText}>0</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.keyBtn, styles.confirmBtn]}
                onPress={handleConfirm}
                activeOpacity={0.7}
              >
                <Text style={styles.nextBtnText}>{hasNextPlayer ? '다음' : '확인'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (s: ScaleFn, f: ScaleFn, line: ScaleFn, theme: ThemeColors) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(8, 12, 20, 0.75)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    backdropTouch: {
      ...StyleSheet.absoluteFillObject,
    },
    keypadOuterFrame: {
      width: s(360),
      backgroundColor: theme.modalBg,
      borderRadius: s(28),
      borderWidth: line(1.5),
      borderColor: theme.border,
      padding: s(22),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: s(12) },
      shadowOpacity: theme.isDark ? 0.45 : 0.15,
      shadowRadius: s(24),
      elevation: 16,
    },
    headerDisplay: {
      backgroundColor: theme.statBoxBg,
      borderRadius: s(18),
      borderWidth: line(1.2),
      borderColor: theme.border,
      paddingHorizontal: s(20),
      paddingVertical: s(14),
      marginBottom: s(20),
      alignItems: 'center',
    },
    playerTitle: {
      color: theme.textSecondary,
      fontSize: f(14),
      fontWeight: '800',
      marginBottom: s(6),
      letterSpacing: s(0.5),
    },
    displayValueRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: s(4),
    },
    displayValueText: {
      color: theme.themeMode === 'theme3' ? '#FF9100' : theme.isDark ? '#03DAC6' : theme.textAccent,
      fontSize: f(48),
      fontWeight: '900',
      fontVariant: ['tabular-nums'],
    },
    displayUnitText: {
      color: theme.textPrimary,
      fontSize: f(20),
      fontWeight: '800',
      marginLeft: s(2),
    },
    grid: {
      gap: s(12),
    },
    row: {
      flexDirection: 'row',
      gap: s(12),
      justifyContent: 'space-between',
    },
    keyBtn: {
      flex: 1,
      height: s(68),
      backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
      borderRadius: s(16),
      borderWidth: line(1),
      borderColor: theme.border,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: s(3) },
      shadowOpacity: theme.isDark ? 0.12 : 0.04,
      shadowRadius: s(4),
      elevation: 2,
    },
    actionBtn: {
      backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
      borderColor: theme.border,
    },
    confirmBtn: {
      backgroundColor: theme.themeMode === 'theme3' ? '#FF9100' : theme.isDark ? '#03DAC6' : theme.textAccent,
      borderColor: 'transparent',
    },
    numKeyText: {
      color: theme.textPrimary,
      fontSize: f(28),
      fontWeight: '800',
    },
    clearBtnText: {
      color: theme.textSecondary,
      fontSize: f(18),
      fontWeight: '700',
    },
    nextBtnText: {
      color: theme.themeMode === 'theme3' ? '#0F172A' : theme.isDark ? '#000000' : '#FFFFFF',
      fontSize: f(18),
      fontWeight: '900',
    },
  });
