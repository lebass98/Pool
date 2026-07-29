import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScaleFn, useScale } from '@/constants/layout';
import { ThemeColors } from '@/constants/themeColors';
import { Player } from '@/types/scoreboard.types';
import { FlipScoreCard } from './FlipScoreCard';

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

  const remainingScore = Math.max(0, player.targetScore - player.currentScore);
  const average =
    player.currentScore > 0 && inning > 0
      ? (player.currentScore / inning).toFixed(2)
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
          borderColor: isFinishedPlayer ? '#FFD54F' : theme.border,
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
              <Text style={styles.rankBadgeText}>{player.finishRank}등 · 종료</Text>
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
              목표 {player.targetScore}점
            </Text>
          </View>

          <View
            style={[
              styles.remainingBadge,
              {
                backgroundColor: isFinishedPlayer
                  ? (theme.isDark ? 'rgba(255, 213, 79, 0.2)' : '#FEF3C7')
                  : (theme.isDark ? 'rgba(3, 218, 198, 0.2)' : '#E0F2FE'),
                borderColor: isFinishedPlayer ? (theme.isDark ? '#FFD54F' : '#D97706') : (theme.isDark ? '#03DAC6' : '#0284C7'),
              },
            ]}
          >
            <Text
              style={[
                styles.remainingText,
                { color: isFinishedPlayer ? (theme.isDark ? '#FFD54F' : '#B45309') : (theme.isDark ? '#03DAC6' : '#0369A1') },
              ]}
            >
              {isFinishedPlayer ? '종료' : `남은 점수 ${remainingScore}점`}
            </Text>
          </View>
        </View>
      </View>

      {/* Main Score Display (두 자릿수 3D 플립 애니메이션 클락) */}
      <View style={styles.scoreContainer}>
        <FlipScoreCard
          score={player.currentScore}
          textColor={theme.textPrimary}
          isCompact={isCompact}
          sizeMode={sizeMode}
        />
      </View>

      {/* Sub Stats: 이번이닝 / 에버리지 / 하이런 */}
      <View
        style={[
          styles.statsRow,
          isCompact && styles.compactStatsRow,
          { backgroundColor: theme.statBoxBg, borderColor: theme.border },
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
      borderWidth: line(2),
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
      borderWidth: line(1.5),
    },
    remainingText: {
      fontSize: f(14),
      fontWeight: '900',
    },
    scoreContainer: {
      alignItems: 'center',
      marginVertical: s(6),
    },
    statsRow: {
      flexDirection: 'row',
      borderRadius: s(14),
      paddingVertical: s(8),
      paddingHorizontal: s(10),
      alignItems: 'center',
      marginVertical: s(8),
      borderWidth: line(1),
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
