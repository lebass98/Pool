import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScaleFn, useScale } from '@/constants/layout';
import { ThemeColors } from '@/constants/themeColors';
import { Player } from '@/types/scoreboard.types';

// 점수 변경 시 3D 카드 입체 회전 애니메이션 컴포넌트 (3D Perspective Flip)
interface FlipScoreTextProps {
  score: number;
  style: any;
}

const FlipScoreText: React.FC<FlipScoreTextProps> = ({ score, style }) => {
  const [displayScore, setDisplayScore] = useState(score);
  const [prevScore, setPrevScore] = useState(score);
  const [isFlipping, setIsFlipping] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (score !== displayScore) {
      setPrevScore(displayScore);
      setDisplayScore(score);
      setIsFlipping(true);
      anim.setValue(0);
      Animated.timing(anim, {
        toValue: 1,
        duration: 360,
        useNativeDriver: true,
      }).start(() => {
        setIsFlipping(false);
      });
    }
  }, [score, displayScore]);

  if (!isFlipping) {
    return (
      <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.4} style={style}>
        {displayScore}
      </Text>
    );
  }

  // 3D Perspective Flip (0 -> 0.5 구간: 이전 점수가 90도 뒤집어지며 접힘 / 0.5 -> 1 구간: 새 점수가 -90도에서 0도로 펼쳐짐)
  const isUp = score < prevScore; // 득점 시 점수 감소
  const prevRotateX = anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', isUp ? '-90deg' : '90deg', isUp ? '-90deg' : '90deg'],
  });
  const prevOpacity = anim.interpolate({
    inputRange: [0, 0.49, 0.5, 1],
    outputRange: [1, 1, 0, 0],
  });

  const currRotateX = anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [isUp ? '90deg' : '-90deg', isUp ? '90deg' : '-90deg', '0deg'],
  });
  const currOpacity = anim.interpolate({
    inputRange: [0, 0.5, 0.51, 1],
    outputRange: [0, 0, 1, 1],
  });

  return (
    <View style={{ position: 'relative', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
      {/* 퇴장하는 이전 점수 (3D Flip Out) */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            justifyContent: 'center',
            alignItems: 'center',
            transform: [{ perspective: 400 }, { rotateX: prevRotateX }],
            opacity: prevOpacity,
          },
        ]}
      >
        <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.4} style={style}>
          {prevScore}
        </Text>
      </Animated.View>

      {/* 등장하는 새 점수 (3D Flip In) */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            justifyContent: 'center',
            alignItems: 'center',
            transform: [{ perspective: 400 }, { rotateX: currRotateX }],
            opacity: currOpacity,
          },
        ]}
      >
        <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.4} style={style}>
          {displayScore}
        </Text>
      </Animated.View>
    </View>
  );
};

interface PlayerCardProps {
  player: Player;
  playerIndex: number;
  isCurrentTurn: boolean;
  inning: number;
  theme: ThemeColors;
  isCompact?: boolean;
  isMultiRow?: boolean;
  onAddScore: (delta: number) => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  playerIndex,
  isCurrentTurn,
  inning,
  theme,
  isCompact = false,
  isMultiRow = false,
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

      {/* Main Score & Sub Stats Container */}
      <View style={isMultiRow ? styles.bodyRow : styles.bodyColumn}>
        {/* Main Score Display (대형 득점 카운터 텍스트 + 3D 카드 입체 회전 애니메이션) */}
        <View style={[styles.scoreContainer, isMultiRow && styles.scoreContainerSide]}>
          <FlipScoreText
            score={player.currentScore}
            style={[
              styles.mainScoreText,
              sizeMode === 'mini' && styles.miniScoreText,
              sizeMode === 'compact' && styles.compactScoreText,
              sizeMode === 'medium' && styles.mediumScoreText,
              isMultiRow && styles.sideScoreText,
              { color: theme.textPrimary },
            ]}
          />
        </View>

        {/* Sub Stats: 이전 이닝 / 이번 이닝 / 에버리지 / 하이런 */}
        <View
          style={[
            isMultiRow ? styles.statsColumn : styles.statsRow,
            isCompact && (isMultiRow ? styles.compactStatsColumn : styles.compactStatsRow),
            { backgroundColor: theme.statBoxBg },
          ]}
        >
          <View style={styles.statBox}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              최근 득점
            </Text>
            <Text style={[styles.statValue, { color: theme.textSecondary }]}>
              {player.lastInningScore > 0 ? `+${player.lastInningScore}` : `${player.lastInningScore}`}
            </Text>
          </View>

          <View style={[isMultiRow ? styles.statDividerHorizontal : styles.statDividerVertical, { backgroundColor: theme.border }]} />

          <View style={styles.statBox}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              이번 이닝
            </Text>
            <Text style={[styles.statValue, { color: theme.textPrimary }]}>
              +{player.currentInningScore}
            </Text>
          </View>

          <View style={[isMultiRow ? styles.statDividerHorizontal : styles.statDividerVertical, { backgroundColor: theme.border }]} />

          <View style={styles.statBox}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              에버리지
            </Text>
            <Text style={[styles.statValue, { color: '#03DAC6' }]}>
              {average}
            </Text>
          </View>

          <View style={[isMultiRow ? styles.statDividerHorizontal : styles.statDividerVertical, { backgroundColor: theme.border }]} />

          <View style={styles.statBox}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              하이런
            </Text>
            <Text style={[styles.statValue, { color: theme.textPrimary }]}>
              {player.highRun}
            </Text>
          </View>
        </View>
      </View>

      {/* Control Buttons (득점: 남은점수 -1, 취소/실수: 남은점수 +1) */}
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
          accessibilityLabel={`${player.name} 감점 (+1)`}
        >
          <Text style={[styles.minusBtnText, { color: theme.textSecondary }]}>
            감점 (+1)
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
          accessibilityLabel={`${player.name} 득점 (-1)`}
          accessibilityState={{ disabled: isFinishedPlayer }}
        >
          <Text style={styles.plusBtnText}>득점 (-1)</Text>
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
      paddingVertical: s(12),
      justifyContent: 'space-between',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: s(6) },
      shadowOpacity: 0.2,
      shadowRadius: s(12),
      elevation: 6,
    },
    compactCard: {
      paddingHorizontal: s(14),
      paddingVertical: s(8),
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
      marginBottom: s(2),
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
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 0,
    },
    mainScoreText: {
      fontFamily: 'PretendardGOV-ExtraBold',
      fontSize: f(280),
      fontWeight: '900',
      letterSpacing: -s(4),
      includeFontPadding: false,
      textAlign: 'center',
    },
    mediumScoreText: {
      fontSize: f(220),
    },
    compactScoreText: {
      fontSize: f(170),
    },
    miniScoreText: {
      fontSize: f(130),
    },
    bodyRow: {
      flexDirection: 'row',
      flex: 1,
      width: '100%',
      gap: s(12),
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    bodyColumn: {
      flex: 1,
      width: '100%',
    },
    scoreContainerSide: {
      flex: 1.5,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    sideScoreText: {
      fontSize: f(130),
    },
    statsRow: {
      flexDirection: 'row',
      borderRadius: s(14),
      paddingVertical: s(8),
      paddingHorizontal: s(10),
      alignItems: 'center',
      marginVertical: s(4),
    },
    compactStatsRow: {
      paddingVertical: s(6),
    },
    statsColumn: {
      flexDirection: 'column',
      borderRadius: s(14),
      paddingVertical: s(12),
      paddingHorizontal: s(10),
      alignItems: 'center',
      justifyContent: 'space-around',
      minWidth: s(110),
      height: '100%',
      marginVertical: 0,
    },
    compactStatsColumn: {
      paddingVertical: s(8),
      paddingHorizontal: s(8),
      minWidth: s(95),
    },
    statBox: {
      flex: 1,
      alignItems: 'center',
    },
    statDividerVertical: {
      width: line(1),
      height: '75%',
    },
    statDividerHorizontal: {
      height: line(1),
      width: '75%',
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
      paddingVertical: s(19.8),
      alignItems: 'center',
      justifyContent: 'center',
    },
    compactScoreBtn: {
      paddingVertical: s(15.4),
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
      fontSize: f(16),
      fontWeight: '800',
    },
    plusBtnText: {
      color: '#000000',
      fontSize: f(17.6),
      fontWeight: '900',
    },
  });
