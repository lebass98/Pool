import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useScale } from '@/constants/layout';
import { DigitSizeMode, FlipDigitCard } from './FlipDigitCard';

interface FlipScoreCardProps {
  score: number;
  textColor?: string;
  isCompact?: boolean;
  sizeMode?: DigitSizeMode;
}

export const FlipScoreCard: React.FC<FlipScoreCardProps> = ({
  score,
  isCompact = false,
  sizeMode,
}) => {
  const { s } = useScale();

  // 항상 2자리 수 (00, 01, 06, 12, 25 등) 로 포맷팅
  const formattedScore = String(Math.max(0, Math.min(99, score))).padStart(2, '0');
  const tensDigit = formattedScore[0];
  const onesDigit = formattedScore[1];

  const gap = sizeMode === 'mini' ? 3 : sizeMode === 'compact' ? 4 : isCompact ? 4 : 6;

  return (
    <View style={[styles.clockContainer, { marginVertical: s(2) }]}>
      {/* 십의 자리 단일 숫자의 독립된 플립 카드 타일 (변경 시에만 해당 타일 애니메이션!) */}
      <FlipDigitCard digit={tensDigit} isCompact={isCompact} sizeMode={sizeMode} />

      {/* 개별 타일 사이 중앙 미세 갭 */}
      <View style={{ width: s(gap) }} />

      {/* 일의 자리 단일 숫자의 독립된 플립 카드 타일 (변경 시에만 해당 타일 애니메이션!) */}
      <FlipDigitCard digit={onesDigit} isCompact={isCompact} sizeMode={sizeMode} />
    </View>
  );
};

const styles = StyleSheet.create({
  clockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
