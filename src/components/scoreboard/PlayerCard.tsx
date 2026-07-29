import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScaleFn, useScale } from '@/constants/layout';
import { ThemeColors } from '@/constants/themeColors';
import { Player } from '@/types/scoreboard.types';

interface PlayerCardProps {
  player: Player;
  playerIndex: number;
  isCurrentTurn: boolean;
  inning: number;
  theme: ThemeColors;
  isCompact?: boolean;
  onAddScore: (delta: number) => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  playerIndex,
  isCurrentTurn,
  inning,
  theme,
  isCompact = false,
  onAddScore,
}) => {
  const { s, f, line, isSmallHeight } = useScale();
  const styles = useMemo(() => createStyles(s, f, line), [s, f, line]);

  const scoredPoints = Math.max(0, player.targetScore - player.currentScore);
  const average =
    scoredPoints > 0 && inning > 0
      ? (scoredPoints / inning).toFixed(2)
      : '0.00';
  const isFinishedPlayer = player.finishRank !== null;
  const isActiveTurn = isCurrentTurn && !isFinishedPlayer;

  const sizeMode = useMemo(() => {
    if (isCompact) {
      return isSmallHeight ? 'mini' : 'compact';
    }
    return isSmallHeight ? 'medium' : 'normal';
  }, [isCompact, isSmallHeight]);

  return (
    <View
      style={[
        styles.card,
        (isCompact || isSmallHeight) && styles.compactCard,
        {
          backgroundColor: isActiveTurn ? theme.cardActiveBg : theme.cardBg,
        },
        isFinishedPlayer && styles.finishedCard,
      ]}
    >
      {/* Header: Player Number Badge, Name + Turn Badge Inline & Target */}
      <View style={styles.header}>
        <View style={styles.nameWithTurnRow}>
          {/* 선수 순번 번호 배지 */}
          <View
            style={[
              styles.playerNumberBadge,
              { backgroundColor: isActiveTurn ? '#03DAC6' : theme.badgeBg },
            ]}
          >
            <Text
              style={[
                styles.playerNumberText,
                { color: isActiveTurn ? '#000000' : theme.textAccent },
              ]}
            >
              {playerIndex + 1}
            </Text>
          </View>

          <Text
            numberOfLines={1}
            style={[
              styles.playerName,
              (isCompact || isSmallHeight) && styles.compactPlayerName,
              { color: theme.textPrimary },
            ]}
          >
            {player.name}
          </Text>

          {isFinishedPlayer ? (
            <View style={styles.rankBadgeInline}>
              <Text style={styles.rankBadgeText}>{player.finishRank}등 · 승리</Text>
            </View>
          ) : (
            isCurrentTurn && (
              <View style={styles.turnBadgeInline}>
                <Text style={styles.turnBadgeText}>공격 중</Text>
              </View>
            )
          )}
        </View>

        <View style={styles.headerRightBadges}>
          <View style={[styles.targetBadge, { backgroundColor: theme.badgeBg }]}>
            <Text style={[styles.targetText, { color: theme.textSecondary }]}>
              시작 {player.targetScore}점
            </Text>
          </View>
        </View>
      </View>

      {/* Main Score Display (대형 득점 카운터 텍스트) */}
      <View style={styles.scoreContainer}>
        <Text
          style={[
            styles.mainScoreText,
            sizeMode === 'mini' && styles.miniScoreText,
            sizeMode === 'compact' && styles.compactScoreText,
            sizeMode === 'medium' && styles.mediumScoreText,
            { color: theme.textPrimary },
          ]}
        >
          {player.currentScore}
        </Text>
      </View>

      {/* Sub Stats: 이번이닝 / 에버리지 / 하이런 */}
      <View
        style={[
          styles.statsRow,
          isCompact && styles.compactStatsRow,
          { backgroundColor: theme.statBoxBg },
        ]}
      >
        <View style={styles.statBox}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            이번 이닝
          </Text>
          <Text style={[styles.statValue, { color: theme.textPrimary }]}>
            +{player.currentInningScore}
          </Text>
        </View>

        <View style={[styles.statDivider, { backgroundColor: theme.border }]} />

        <View style={styles.statBox}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            에버리지
          </Text>
          <Text style={[styles.statValue, { color: '#03DAC6' }]}>
            {average}
          </Text>
        </View>

        <View style={[styles.statDivider, { backgroundColor: theme.border }]} />

        <View style={styles.statBox}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            하이런
          </Text>
          <Text style={[styles.statValue, { color: theme.textPrimary }]}>
            {player.highRun}
          </Text>
        </View>
      </View>

      {/* Control Buttons (+1 / -1) */}
      <View style={styles.btnRow}>
        <TouchableOpacity
          style={[
            styles.scoreBtn,
            styles.minusBtn,
            isCompact && styles.compactScoreBtn,
            { backgroundColor: theme.badgeBg },
          ]}
          onPress={() => onAddScore(-1)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`${player.name} 1점 차감`}
        >
          <Text style={[styles.minusBtnText, { color: theme.textSecondary }]}>
            -1
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.scoreBtn,
            styles.plusBtn,
            isCompact && styles.compactScoreBtn,
            isFinishedPlayer && styles.disabledPlusBtn,
          ]}
          onPress={() => onAddScore(1)}
          activeOpacity={0.7}
          disabled={isFinishedPlayer}
          accessibilityRole="button"
          accessibilityLabel={`${player.name} 1점 추가`}
          accessibilityState={{ disabled: isFinishedPlayer }}
        >
          <Text style={styles.plusBtnText}>+1</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

/** 스타일 수치는 모두 1920 x 1080 기준 픽셀값 */
const createStyles = (s: ScaleFn, f: ScaleFn, line: ScaleFn) =>
  StyleSheet.create({
    card: {
      flex: 1,
      width: '100%',
      borderRadius: s(22),
      paddingHorizontal: s(20),
      paddingVertical: s(18),
      justifyContent: 'space-between',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: s(6) },
      shadowOpacity: 0.2,
      shadowRadius: s(12),
      elevation: 6,
    },
    compactCard: {
      paddingHorizontal: s(14),
      paddingVertical: s(12),
      borderRadius: s(18),
    },
    activeShadow: {
      shadowColor: '#03DAC6',
      shadowOpacity: 0.35,
      shadowRadius: s(14),
    },
    finishedCard: {
      opacity: 0.72,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: s(4),
    },
    nameWithTurnRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      marginRight: s(6),
      gap: s(8),
    },
    playerNumberBadge: {
      width: s(28),
      height: s(28),
      borderRadius: s(14),
      alignItems: 'center',
      justifyContent: 'center',
    },
    playerNumberText: {
      fontSize: f(14),
      fontWeight: '900',
    },
    playerName: {
      fontSize: f(24),
      fontWeight: '900',
    },
    compactPlayerName: {
      fontSize: f(18),
    },
    turnBadgeInline: {
      backgroundColor: '#03DAC6',
      paddingHorizontal: s(10),
      paddingVertical: s(4),
      borderRadius: s(10),
    },
    turnBadgeText: {
      color: '#000000',
      fontWeight: '800',
      fontSize: f(12),
    },
    rankBadgeInline: {
      backgroundColor: '#FFD54F',
      paddingHorizontal: s(10),
      paddingVertical: s(4),
      borderRadius: s(10),
    },
    rankBadgeText: {
      color: '#000000',
      fontWeight: '800',
      fontSize: f(12),
    },
    headerRightBadges: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s(6),
    },
    targetBadge: {
      paddingHorizontal: s(10),
      paddingVertical: s(5),
      borderRadius: s(10),
    },
    targetText: {
      fontSize: f(14),
      fontWeight: '700',
    },
    remainingBadge: {
      paddingHorizontal: s(10),
      paddingVertical: s(5),
      borderRadius: s(10),
    },
    remainingText: {
      fontSize: f(14),
      fontWeight: '900',
    },
    scoreContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: s(6),
    },
    mainScoreText: {
      fontFamily: 'PretendardGOV-ExtraBold',
      fontSize: f(110),
      fontWeight: '900',
      letterSpacing: -s(2),
      includeFontPadding: false,
    },
    mediumScoreText: {
      fontSize: f(85),
    },
    compactScoreText: {
      fontSize: f(65),
    },
    miniScoreText: {
      fontSize: f(50),
    },
    statsRow: {
      flexDirection: 'row',
      borderRadius: s(14),
      paddingVertical: s(8),
      paddingHorizontal: s(10),
      alignItems: 'center',
      marginVertical: s(8),
    },
    compactStatsRow: {
      paddingVertical: s(6),
    },
    statBox: {
      flex: 1,
      alignItems: 'center',
    },
    statDivider: {
      width: line(1),
      height: '75%',
    },
    statLabel: {
      fontSize: f(12),
      fontWeight: '600',
    },
    statValue: {
      fontSize: f(16),
      fontWeight: '800',
      marginTop: s(2),
    },
    btnRow: {
      flexDirection: 'row',
      gap: s(10),
      marginTop: s(6),
    },
    scoreBtn: {
      borderRadius: s(14),
      paddingVertical: s(18),
      alignItems: 'center',
      justifyContent: 'center',
    },
    compactScoreBtn: {
      paddingVertical: s(14),
    },
    minusBtn: {
      flex: 1,
    },
    plusBtn: {
      flex: 2,
      backgroundColor: '#03DAC6',
    },
    disabledPlusBtn: {
      backgroundColor: '#546E7A',
      opacity: 0.6,
    },
    minusBtnText: {
      fontSize: f(20),
      fontWeight: '800',
    },
    plusBtnText: {
      color: '#000000',
      fontSize: f(22),
      fontWeight: '900',
    },
  });
