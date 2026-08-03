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
  const styles = React.useMemo(() => createStyles(s, f, line), [s, f, line]);
  const [inputValue, setInputValue] = useState<string>(String(initialValue));

  useEffect(() => {
    if (visible) {
      setInputValue(String(initialValue));
    }
  }, [visible, initialValue]);

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
    onClose();
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
              {playerName} 목표 점수
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

            {/* 지움, 0, 확인 */}
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
                style={[styles.keyBtn, styles.actionBtn]}
                onPress={handleConfirm}
                activeOpacity={0.7}
              >
                <Text style={styles.nextBtnText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (s: ScaleFn, f: ScaleFn, line: ScaleFn) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.78)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    backdropTouch: {
      ...StyleSheet.absoluteFillObject,
    },
    keypadOuterFrame: {
      width: s(320),
      backgroundColor: '#121418',
      borderRadius: s(20),
      borderWidth: line(2.5),
      borderColor: '#4A505C',
      padding: s(16),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: s(10) },
      shadowOpacity: 0.5,
      shadowRadius: s(20),
      elevation: 12,
    },
    headerDisplay: {
      backgroundColor: '#1C2028',
      borderRadius: s(12),
      borderWidth: line(1),
      borderColor: '#333A48',
      paddingHorizontal: s(16),
      paddingVertical: s(12),
      marginBottom: s(16),
      alignItems: 'center',
    },
    playerTitle: {
      color: '#94A3B8',
      fontSize: f(14),
      fontWeight: '700',
      marginBottom: s(4),
    },
    displayValueRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: s(4),
    },
    displayValueText: {
      color: '#03DAC6',
      fontSize: f(36),
      fontWeight: '900',
      fontVariant: ['tabular-nums'],
    },
    displayUnitText: {
      color: '#CBD5E1',
      fontSize: f(18),
      fontWeight: '800',
    },
    grid: {
      gap: s(10),
    },
    row: {
      flexDirection: 'row',
      gap: s(10),
      justifyContent: 'space-between',
    },
    keyBtn: {
      flex: 1,
      height: s(62),
      backgroundColor: '#2A2E38',
      borderRadius: s(12),
      borderWidth: line(1.5),
      borderColor: '#454C5A',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: s(4) },
      shadowOpacity: 0.3,
      shadowRadius: s(4),
      elevation: 4,
    },
    actionBtn: {
      backgroundColor: '#20242D',
      borderColor: '#3A404E',
    },
    numKeyText: {
      color: '#FFFFFF',
      fontSize: f(28),
      fontWeight: '900',
    },
    clearBtnText: {
      color: '#E2E8F0',
      fontSize: f(18),
      fontWeight: '800',
    },
    nextBtnText: {
      color: '#FBBF24',
      fontSize: f(18),
      fontWeight: '900',
    },
  });
