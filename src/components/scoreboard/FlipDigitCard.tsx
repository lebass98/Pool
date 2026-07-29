import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { ScaleFn, useScale } from '@/constants/layout';

export type DigitSizeMode = 'normal' | 'medium' | 'compact' | 'mini';

interface FlipDigitCardProps {
  digit: string; // 단일 자릿수 '0' ~ '9'
  isCompact?: boolean;
  sizeMode?: DigitSizeMode;
}

/** 1920 x 1080 기준 타일 규격 (숫자와 카드가 딱 붙지 않고 여백이 있도록 비율 조정) */
const TILE = {
  normal: { width: 175, height: 235, fontSize: 165, radius: 24, border: 3.5 },
  medium: { width: 125, height: 165, fontSize: 115, radius: 18, border: 3.0 },
  compact: { width: 95, height: 125, fontSize: 86, radius: 14, border: 2.2 },
  mini: { width: 68, height: 90, fontSize: 60, radius: 10, border: 1.8 },
};

export const FlipDigitCard: React.FC<FlipDigitCardProps> = ({
  digit,
  isCompact = false,
  sizeMode,
}) => {
  const { s, line } = useScale();
  const [currentDigit, setCurrentDigit] = useState(digit);
  const [nextDigit, setNextDigit] = useState(digit);

  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (digit !== currentDigit) {
      setNextDigit(digit);

      animValue.setValue(0);
      Animated.timing(animValue, {
        toValue: 1,
        duration: 180,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start(() => {
        setCurrentDigit(digit);
        animValue.setValue(0);
      });
    }
  }, [digit]);

  // 상단 패널 회전 (0deg -> -90deg)
  const topRotateX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-90deg'],
  });

  const mode = sizeMode || (isCompact ? 'compact' : 'normal');
  const spec = TILE[mode] || TILE.normal;
  const styles = useMemo(() => createStyles(s, line), [s, line]);

  // 기준 해상도 대비 실제 타일 높이 (플립 접힘 계산에 사용)
  const h = s(spec.height);
  const halfH = h / 2;

  const tileStyle = {
    width: s(spec.width),
    height: h,
    borderRadius: s(spec.radius),
    borderWidth: line(spec.border),
    marginHorizontal: s(isCompact ? 2 : 4),
  };
  const digitTextStyle = {
    fontSize: s(spec.fontSize),
    transform: [{ scaleY: 1.18 }, { scaleX: 0.88 }],
  };
  const panelRadius = s(spec.radius - 2);

  return (
    <View style={[styles.tileContainer, tileStyle]}>
      {/* 1. 상단 고정 패널 (새 자릿수 상단 절반만 노출) */}
      <View
        style={[
          styles.panel,
          { borderTopLeftRadius: panelRadius, borderTopRightRadius: panelRadius, top: 0 },
        ]}
      >
        <View style={[styles.textHolder, { top: 0, height: h }]}>
          <Text style={[styles.digitText, digitTextStyle]}>{nextDigit}</Text>
        </View>
      </View>

      {/* 2. 하단 고정 패널 (현재 자릿수 하단 절반만 노출) */}
      <View
        style={[
          styles.panel,
          {
            borderBottomLeftRadius: panelRadius,
            borderBottomRightRadius: panelRadius,
            bottom: 0,
          },
        ]}
      >
        <View style={[styles.textHolder, { top: -halfH, height: h }]}>
          <Text style={[styles.digitText, digitTextStyle]}>{currentDigit}</Text>
        </View>
      </View>

      {/* 3. 상단 플립 애니메이션 패널 (이전 자릿수의 상단 절반이 아래로 접힘) */}
      <Animated.View
        style={[
          styles.panel,
          styles.animatedPanel,
          {
            top: 0,
            borderTopLeftRadius: panelRadius,
            borderTopRightRadius: panelRadius,
            transform: [
              { perspective: s(900) },
              { translateY: halfH / 2 },
              { rotateX: topRotateX },
              { translateY: -halfH / 2 },
            ],
          },
        ]}
      >
        <View style={[styles.textHolder, { top: 0, height: h }]}>
          <Text style={[styles.digitText, digitTextStyle]}>{currentDigit}</Text>
        </View>
      </Animated.View>

      {/* 정중앙 수평 분리선 & 메탈 힌지 마크 */}
      <View style={styles.centerSplitLine} />
      <View style={[styles.hinge, styles.hingeLeft, isCompact && styles.compactHingeLeft]} />
      <View style={[styles.hinge, styles.hingeRight, isCompact && styles.compactHingeRight]} />
    </View>
  );
};

const createStyles = (s: ScaleFn, line: ScaleFn) =>
  StyleSheet.create({
    tileContainer: {
      backgroundColor: '#1C1C1E',
      borderColor: '#3A3A3C',
      overflow: 'hidden',
      position: 'relative',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: s(8) },
      shadowOpacity: 0.55,
      shadowRadius: s(12),
      elevation: 10,
    },
    panel: {
      position: 'absolute',
      left: 0,
      right: 0,
      width: '100%',
      height: '50%',
      backgroundColor: '#1C1C1E',
      overflow: 'hidden',
    },
    animatedPanel: {
      zIndex: 10,
      backgroundColor: '#2C2C2E',
      backfaceVisibility: 'hidden',
    },
    textHolder: {
      position: 'absolute',
      left: 0,
      right: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    digitText: {
      fontWeight: '900',
      color: '#FFFFFF',
      fontVariant: ['tabular-nums'],
      includeFontPadding: false,
    },
    centerSplitLine: {
      position: 'absolute',
      top: '50%',
      marginTop: -line(1),
      left: 0,
      right: 0,
      height: line(3),
      backgroundColor: '#0A0A0C',
      zIndex: 20,
    },
    hinge: {
      position: 'absolute',
      top: '50%',
      marginTop: -s(9),
      width: s(8),
      height: s(18),
      backgroundColor: '#48484A',
      borderRadius: s(4),
      borderWidth: line(1.5),
      borderColor: '#1C1C1E',
      zIndex: 30,
    },
    hingeLeft: {
      left: -s(4),
    },
    hingeRight: {
      right: -s(4),
    },
    compactHingeLeft: {
      width: s(5),
      height: s(11),
      marginTop: -s(5.5),
      left: -s(2.5),
    },
    compactHingeRight: {
      width: s(5),
      height: s(11),
      marginTop: -s(5.5),
      right: -s(2.5),
    },
  });
