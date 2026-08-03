import React, { useMemo, useState } from 'react';
import {
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BlurView } from 'expo-blur';
import { GameControlBar } from '@/components/scoreboard/GameControlBar';
import { GameSettingsModal } from '@/components/scoreboard/GameSettingsModal';
import { PlayerCard } from '@/components/scoreboard/PlayerCard';
import { StartLandingScreen } from '@/components/scoreboard/StartLandingScreen';
import { ThemeSelectionModal } from '@/components/scoreboard/ThemeSelectionModal';
import { ScaleFn, useScale } from '@/constants/layout';
import {
  ThemeMode,
  theme1Dark,
  theme2Light,
  theme3Neon,
} from '@/constants/themeColors';
import { useBilliardsTimer } from '@/hooks/useBilliardsTimer';
import { useScoreboard } from '@/hooks/useScoreboard';

export default function BilliardsScoreboardScreen() {
  const [tableNumber, setTableNumber] = useState('1번 테이블');
  const [themeMode, setThemeMode] = useState<ThemeMode>('theme1');
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isTimerConfirmOpen, setIsTimerConfirmOpen] = useState(false);
  const [isFinishConfirmOpen, setIsFinishConfirmOpen] = useState(false);

  const theme =
    themeMode === 'theme1'
      ? theme1Dark
      : themeMode === 'theme2'
        ? theme2Light
        : theme3Neon;

  const handleToggleTheme = () => {
    setThemeMode((prev) => {
      if (prev === 'theme1') return 'theme2';
      if (prev === 'theme2') return 'theme3';
      return 'theme1';
    });
  };

  // 1920 x 1080 기준 수치를 현재 화면 크기에 맞춰 비례 환산
  const { s, f, line, height, isSmallHeight } = useScale();
  const styles = useMemo(
    () => createStyles(s, f, line, isSmallHeight),
    [s, f, line, isSmallHeight]
  );

  const {
    isRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    toggleTimer,
    formattedTime,
  } = useBilliardsTimer();

  const {
    gameType,
    registeredPlayers,
    players,
    gameState,
    rankedPlayers,
    canUndo,
    setGameType,
    updatePlayerTargetScore,
    setPlayerExactTargetScore,
    addRegisteredPlayer,
    deleteRegisteredPlayer,
    selectPlayersForGame,
    addScore,
    finishGame,
    endTurn,
    undo,
    resetGame,
  } = useScoreboard();

  // 득점 처리
  const handleAddScore = (playerIndex: number, delta: number) => {
    if (!isRunning && delta > 0) {
      startTimer();
    }
    addScore(playerIndex, delta);
  };

  // 랜딩 화면에서 [게임 시작하기] 클릭
  const handleLandingStartGame = () => {
    setIsGameStarted(true);
    startTimer();
  };

  // 인원 변경 선택 핸들러
  const handleLandingSelectPlayerCount = (count: number) => {
    const defaultSelected = registeredPlayers.slice(0, count).map((p) => p.id);
    selectPlayersForGame(defaultSelected);
  };

  // 스코어보드에서 시작/일시정지 프롬프트 열기
  const handleTimerPrompt = () => {
    setIsTimerConfirmOpen(true);
  };

  // 타이머 시작/일시정지 확인 처리
  const handleConfirmTimerToggle = () => {
    toggleTimer();
    setIsTimerConfirmOpen(false);
  };

  // 수동 경기 종료 프롬프트 열기
  const handleFinishGamePrompt = () => {
    setIsFinishConfirmOpen(true);
  };

  // 수동 경기 종료 확인 처리
  const handleConfirmFinishGame = () => {
    pauseTimer();
    finishGame();
    setIsFinishConfirmOpen(false);
  };

  // 리셋 버튼 클릭 시 재확인 모달 열기
  const handleResetPrompt = () => {
    setIsResetConfirmOpen(true);
  };

  // 실제로 리셋 수행 -> 첫화면으로 컴백
  const handleConfirmReset = () => {
    resetGame();
    resetTimer();
    setIsGameStarted(false);
    setIsResetConfirmOpen(false);
  };

  // 통합 설정 저장 및 경기 적용
  const handleSaveSettings = (
    playerCount: number,
    selectedPlayerIds: string[]
  ) => {
    selectPlayersForGame(selectedPlayerIds);
    resetTimer();
  };

  // 승자 / 꼴지 객체 찾기
  const winner = players.find((p) => p.id === gameState.winnerId);
  const loser = players.find((p) => p.id === gameState.loserId);
  const isCompact = players.length >= 3 || isSmallHeight;
  const isMultiPlayerRule = players.length >= 3;

  return (
    <View
      style={[
        styles.overlayBackground,
        {
          backgroundColor: theme.bg,
        },
      ]}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            {!isGameStarted ? (
              /* 첫 화면 (Start Landing Screen) */
              <StartLandingScreen
                theme={theme}
                tableNumber={tableNumber}
                gameType={gameType}
                currentPlayerCount={players.length}
                players={players}
                registeredPlayers={registeredPlayers}
                onSelectGameType={setGameType}
                onSelectPlayerCount={handleLandingSelectPlayerCount}
                onUpdateTargetScore={updatePlayerTargetScore}
                onSetExactTargetScore={setPlayerExactTargetScore}
                onOpenSettings={() => setIsSettingsOpen(true)}
                onStartGame={handleLandingStartGame}
                onToggleTheme={() => setIsThemeModalOpen(true)}
              />
            ) : (
              /* 메인 디지털 스코어보드 화면 */
              <View style={styles.container}>
                {/* Top Bar: Table Info, Inning & Game Timer */}
                <View
                  style={[
                    styles.topBar,
                    { backgroundColor: theme.topBarBg },
                  ]}
                >
                  {/* Left: Table Badge & GameType */}
                  <View style={styles.tableLeftBox}>
                    <View
                      style={[styles.tableBadge, { backgroundColor: theme.badgeBg }]}
                    >
                      <Text
                        style={[styles.tableBadgeText, { color: theme.textAccent }]}
                      >
                        {tableNumber} • {gameType === '3ball' ? '3구' : '4구'} (
                        {players.length}인 경기)
                      </Text>
                    </View>
                  </View>

                  {/* Center: Timer Container */}
                  <View style={styles.timerCenterBox}>
                    <View
                      style={[
                        styles.timerContainer,
                        {
                          backgroundColor:
                            theme.themeMode === 'theme2'
                              ? '#0F172A'
                              : theme.themeMode === 'theme3'
                              ? '#3B0764'
                              : 'rgba(15, 23, 42, 0.9)',
                        },
                      ]}
                    >
                      <Text style={styles.timerText}>{formattedTime}</Text>
                    </View>
                  </View>

                  {/* Right: Inning Badge */}
                  <View style={styles.inningRightBox}>
                    <View
                      style={[styles.inningBadge, { backgroundColor: theme.badgeBg }]}
                    >
                      <Text
                        style={[styles.inningBadgeText, { color: theme.textPrimary }]}
                      >
                        제 {gameState.inning} 이닝
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Middle Section: Multi-Player Score Cards & Center Floating Turn Button */}
                <View style={styles.cardsScrollContainer}>
                  <View style={styles.cardsGrid}>
                    {players.map((player, index) => {
                      const isCurrentTurn = gameState.currentTurnIndex === index;
                      const count = players.length;

                      return (
                        <View
                          key={player.id}
                          style={[
                            styles.cardWrapper,
                            count === 2 && styles.twoPlayerWrapper,
                            count === 3 && styles.threePlayerWrapper,
                            count === 4 && styles.fourPlayerWrapper,
                            count === 5 &&
                              (index < 3
                                ? styles.fiveTopWrapper
                                : styles.fiveBottomWrapper),
                            count === 6 && styles.sixPlayerWrapper,
                            (count === 7 || count === 8) && styles.eightPlayerWrapper,
                          ]}
                        >
                          <PlayerCard
                            player={player}
                            playerIndex={index}
                            isCurrentTurn={isCurrentTurn}
                            inning={gameState.inning}
                            theme={theme}
                            isCompact={isCompact}
                            isMultiRow={players.length >= 4}
                            onAddScore={(delta) => handleAddScore(index, delta)}
                          />
                        </View>
                      );
                    })}
                  </View>

                  {/* 인원 카드 정중앙 희미한 원형 회전 턴 넘기기 버튼 */}
                  <TouchableOpacity
                    style={[
                      styles.centerTurnBtn,
                      {
                        backgroundColor: theme.isDark
                          ? 'rgba(15, 23, 42, 0.45)'
                          : 'rgba(255, 255, 255, 0.55)',
                      },
                    ]}
                    onPress={endTurn}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel="턴 넘기기"
                  >
                    <Text
                      style={[
                        styles.centerTurnIconText,
                        { color: theme.isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(15, 23, 42, 0.85)' },
                      ]}
                    >
                      ↺
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Bottom Section: Game Controls */}
                <GameControlBar
                  isRunningTimer={isRunning}
                  canUndo={canUndo}
                  theme={theme}
                  onToggleTimer={handleTimerPrompt}
                  onFinishGamePrompt={handleFinishGamePrompt}
                  onUndo={undo}
                  onToggleTheme={() => setIsThemeModalOpen(true)}
                  onOpenSettings={() => setIsSettingsOpen(true)}
                  onResetGame={handleResetPrompt}
                />

                {/* 일시정지 중앙 화면 오버레이 */}
                {isGameStarted && !isRunning && !gameState.isFinished && (
                  <View style={styles.pauseOverlay} pointerEvents="box-none">
                    <View
                      style={[
                        styles.pauseCard,
                        {
                          backgroundColor: theme.isDark
                            ? 'rgba(15, 23, 42, 0.92)'
                            : 'rgba(255, 255, 255, 0.95)',
                          borderColor: theme.isDark
                            ? 'rgba(255, 204, 128, 0.4)'
                            : 'rgba(0, 0, 0, 0.15)',
                        },
                      ]}
                    >
                      <View style={styles.pauseIconBadge}>
                        <Text style={styles.pauseIconText}>⏸</Text>
                      </View>

                      <Text
                        style={[
                          styles.pauseTitleText,
                          { color: theme.textPrimary },
                        ]}
                      >
                        일시정지
                      </Text>

                      <Text
                        style={[
                          styles.pauseSubText,
                          { color: theme.textSecondary },
                        ]}
                      >
                        경기시간 측정이 일시 정지되었습니다.{'\n'}다시 시작하시려면 아래 버튼을 눌러주세요.
                      </Text>

                      <TouchableOpacity
                        style={styles.resumeBtn}
                        onPress={startTimer}
                        activeOpacity={0.8}
                        accessibilityRole="button"
                        accessibilityLabel="게임 재개"
                      >
                        <Text style={styles.resumeBtnText}>▶ 게임 재개하기</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* 시작 / 일시정지 재확인 알림 모달 */}
            <Modal visible={isTimerConfirmOpen} transparent animationType="fade">
              <View style={styles.confirmOverlay}>
                <View
                  style={[
                    styles.confirmCard,
                    {
                      backgroundColor: theme.modalBg,
                      borderColor: isRunning ? '#FFCC80' : '#03DAC6',
                    },
                  ]}
                >
                  <Text
                    style={[styles.confirmTitle, { color: theme.textPrimary }]}
                  >
                    {isRunning
                      ? '경기 시간을 일시정지하시겠습니까?'
                      : '게임을 시작하시겠습니까?'}
                  </Text>
                  <Text
                    style={[
                      styles.confirmDescription,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {isRunning
                      ? '선수들의 쉬는 시간이나 휴식을 위해 경기 시간 측정이 일시 정지됩니다.'
                      : '경기 시간 측정이 시작됩니다. 선수들의 경기 시간이 흐릅니다.'}
                  </Text>

                  <View style={styles.confirmBtnRow}>
                    <TouchableOpacity
                      style={[
                        styles.confirmCancelBtn,
                        { backgroundColor: theme.badgeBg },
                      ]}
                      onPress={() => setIsTimerConfirmOpen(false)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.confirmCancelText,
                          { color: theme.textPrimary },
                        ]}
                      >
                        취소 (돌아가기)
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.confirmResetBtn,
                        { backgroundColor: isRunning ? '#FFB74D' : '#03DAC6' },
                      ]}
                      onPress={handleConfirmTimerToggle}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.confirmResetText,
                          { color: '#000000' },
                        ]}
                      >
                        {isRunning ? '일시정지' : '게임 시작'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* 경기종료 수동 선언 재확인 모달 */}
            <Modal visible={isFinishConfirmOpen} transparent animationType="fade">
              <View style={styles.confirmOverlay}>
                <View
                  style={[
                    styles.confirmCard,
                    { backgroundColor: theme.modalBg, borderColor: '#E53935' },
                  ]}
                >
                  <Text
                    style={[styles.confirmTitle, { color: theme.textPrimary }]}
                  >
                    경기를 완료하고 종료하시겠습니까?
                  </Text>
                  <Text
                    style={[
                      styles.confirmDescription,
                      { color: theme.textSecondary },
                    ]}
                  >
                    현재 점수를 기준으로 경기 최고 득점자를 승자로 선언하고 경기가 종료됩니다.
                  </Text>

                  <View style={styles.confirmBtnRow}>
                    <TouchableOpacity
                      style={[
                        styles.confirmCancelBtn,
                        { backgroundColor: theme.badgeBg },
                      ]}
                      onPress={() => setIsFinishConfirmOpen(false)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.confirmCancelText,
                          { color: theme.textPrimary },
                        ]}
                      >
                        취소 (돌아가기)
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.confirmResetBtn,
                        { backgroundColor: '#E53935' },
                      ]}
                      onPress={handleConfirmFinishGame}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.confirmResetText, { color: '#FFFFFF' }]}>
                        경기 종료하기
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* 리셋 재확인 모달 */}
            <Modal visible={isResetConfirmOpen} transparent animationType="fade">
              <View style={styles.confirmOverlay}>
                <View
                  style={[
                    styles.confirmCard,
                    { backgroundColor: theme.modalBg, borderColor: '#DC2626' },
                  ]}
                >
                  <Text
                    style={[styles.confirmTitle, { color: theme.textPrimary }]}
                  >
                    경기를 리셋하시겠습니까?
                  </Text>
                  <Text
                    style={[
                      styles.confirmDescription,
                      { color: theme.textSecondary },
                    ]}
                  >
                    현재 진행 중인 점수, 이닝 및 경기 시간이 모두 초기화되며 복구할 수
                    없습니다.
                  </Text>

                  <View style={styles.confirmBtnRow}>
                    <TouchableOpacity
                      style={[
                        styles.confirmCancelBtn,
                        { backgroundColor: theme.badgeBg },
                      ]}
                      onPress={() => setIsResetConfirmOpen(false)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.confirmCancelText,
                          { color: theme.textPrimary },
                        ]}
                      >
                        취소 (돌아가기)
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.confirmResetBtn}
                      onPress={handleConfirmReset}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.confirmResetText}>정말 리셋하기</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* 테마 선택 프리뷰 모달 */}
            <ThemeSelectionModal
              visible={isThemeModalOpen}
              currentThemeMode={themeMode}
              theme={theme}
              onClose={() => setIsThemeModalOpen(false)}
              onSelectTheme={(mode) => setThemeMode(mode)}
            />

            {/* 경기 통합 설정 모달 */}
            <GameSettingsModal
              visible={isSettingsOpen}
              currentPlayerCount={players.length}
              registeredPlayers={registeredPlayers}
              onClose={() => setIsSettingsOpen(false)}
              onAddPlayer={addRegisteredPlayer}
              onDeletePlayer={deleteRegisteredPlayer}
              onSaveSettings={handleSaveSettings}
            />

            {/* 게임 종료 / 승리 알림 모달 */}
            <Modal visible={gameState.isFinished} transparent animationType="slide">
              <View style={styles.winOverlay}>
                <View
                  style={[
                    styles.winCard,
                    { backgroundColor: theme.modalBg, borderColor: '#03DAC6' },
                  ]}
                >
                  <Text style={[styles.winTitle, { color: theme.textPrimary }]}>
                    경기 종료!
                  </Text>
                  <Text style={styles.winSubtitle}>
                    {winner?.name} 님이 승리하셨습니다!
                  </Text>

                  {/* 3인 이상: 달성 순위 & 꼴지 발표 */}
                  {isMultiPlayerRule && (
                    <View style={styles.rankList}>
                      {rankedPlayers.map((p, idx) => (
                        <View key={p.id} style={styles.rankRow}>
                          <Text style={[styles.rankPosition, { color: '#03DAC6' }]}>
                            {idx + 1}등
                          </Text>
                          <Text
                            style={[styles.rankName, { color: theme.textPrimary }]}
                            numberOfLines={1}
                          >
                            {p.name}
                          </Text>
                          <Text
                            style={[styles.rankScore, { color: theme.textSecondary }]}
                          >
                            {p.currentScore} / {p.targetScore}점
                          </Text>
                        </View>
                      ))}

                      {loser && (
                        <View style={styles.rankRow}>
                          <Text style={[styles.rankPosition, { color: '#EF5350' }]}>
                            꼴지
                          </Text>
                          <Text
                            style={[styles.rankName, { color: theme.textPrimary }]}
                            numberOfLines={1}
                          >
                            {loser.name}
                          </Text>
                          <Text
                            style={[styles.rankScore, { color: theme.textSecondary }]}
                          >
                            {loser.currentScore} / {loser.targetScore}점
                          </Text>
                        </View>
                      )}
                    </View>
                  )}

                  <Text style={[styles.winStats, { color: theme.textSecondary }]}>
                    총 경기 시간: {formattedTime} | 총 {gameState.inning} 이닝
                  </Text>

                  <TouchableOpacity
                    style={styles.winResetBtn}
                    onPress={handleConfirmReset}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.winResetBtnText}>새 경기 시작하기</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </SafeAreaView>
    </View>
  );
}

/** 스타일 수치는 모두 1920 x 1080 기준 픽셀값 */
const createStyles = (
  s: ScaleFn,
  f: ScaleFn,
  line: ScaleFn,
  isSmallHeight: boolean
) =>
  StyleSheet.create({
    backgroundImage: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    blurOverlay: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    overlayBackground: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    safeArea: {
      flex: 1,
    },
    container: {
      flex: 1,
      paddingHorizontal: s(16),
      paddingVertical: s(isSmallHeight ? 8 : 16),
      gap: s(isSmallHeight ? 8 : 16),
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: s(16),
      paddingHorizontal: s(14),
      paddingVertical: s(isSmallHeight ? 4 : 6),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: s(4) },
      shadowOpacity: 0.2,
      shadowRadius: s(10),
      elevation: 4,
    },
    tableLeftBox: {
      flex: 1,
      alignItems: 'flex-start',
    },
    timerCenterBox: {
      flex: 1,
      alignItems: 'center',
    },
    inningRightBox: {
      flex: 1,
      alignItems: 'flex-end',
    },
    tableBadge: {
      paddingHorizontal: s(12),
      paddingVertical: s(4),
      borderRadius: s(10),
    },
    tableBadgeText: {
      fontSize: f(isSmallHeight ? 14 : 17),
      fontWeight: '800',
    },
    inningBadge: {
      paddingHorizontal: s(14),
      paddingVertical: s(4),
      borderRadius: s(10),
    },
    inningBadgeText: {
      fontSize: f(isSmallHeight ? 15 : 18),
      fontWeight: '800',
    },
    timerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s(8),
      paddingHorizontal: s(14),
      paddingVertical: s(4),
      borderRadius: s(12),
    },
    timerLabel: {
      color: 'rgba(255, 255, 255, 0.85)',
      fontSize: f(isSmallHeight ? 13 : 15),
      fontWeight: '800',
    },
    timerText: {
      color: '#FFD600',
      fontSize: f(isSmallHeight ? 36 : 48),
      fontWeight: '900',
      letterSpacing: s(1.5),
      fontVariant: ['tabular-nums'],
    },
    cardsScrollContainer: {
      flex: 1,
      marginVertical: 0,
      position: 'relative',
      justifyContent: 'center',
    },
    cardsGrid: {
      flex: 1,
      height: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignContent: 'space-between',
    },
    cardWrapper: {
      //
    },
    twoPlayerWrapper: {
      width: '49.2%',
      height: '100%',
    },
    threePlayerWrapper: {
      width: '32.2%',
      height: '100%',
    },
    fourPlayerWrapper: {
      width: '49.2%',
      height: '49.2%',
    },
    fiveTopWrapper: {
      width: '32.2%',
      height: '49.2%',
    },
    fiveBottomWrapper: {
      width: '49.2%',
      height: '49.2%',
    },
    sixPlayerWrapper: {
      width: '32.2%',
      height: '49.2%',
    },
    eightPlayerWrapper: {
      width: '23.8%',
      height: '49.2%',
    },
    centerTurnBtn: {
      position: 'absolute',
      alignSelf: 'center',
      top: '50%',
      transform: [{ translateY: -s(125) }],
      width: s(250),
      height: s(250),
      borderRadius: s(125),
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99,
    },
    centerTurnIconText: {
      fontSize: f(135),
      fontWeight: '900',
      lineHeight: f(145),
      textAlign: 'center',
    },
    confirmOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.82)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: s(20),
    },
    confirmCard: {
      width: '90%',
      maxWidth: s(640),
      borderRadius: s(24),
      paddingVertical: s(28),
      paddingHorizontal: s(36),
      alignItems: 'center',
      borderWidth: line(2),
    },
    confirmTitle: {
      fontSize: f(22),
      fontWeight: '900',
      marginBottom: s(12),
      textAlign: 'center',
    },
    confirmDescription: {
      fontSize: f(15),
      fontWeight: '500',
      textAlign: 'center',
      marginBottom: s(24),
      lineHeight: f(22),
    },
    confirmBtnRow: {
      flexDirection: 'row',
      gap: s(12),
      width: '100%',
    },
    confirmCancelBtn: {
      flex: 1,
      borderRadius: s(14),
      paddingVertical: s(14),
      alignItems: 'center',
    },
    confirmResetBtn: {
      flex: 1,
      backgroundColor: '#DC2626',
      borderRadius: s(14),
      paddingVertical: s(14),
      alignItems: 'center',
    },
    confirmCancelText: {
      fontWeight: '800',
      fontSize: f(15),
    },
    confirmResetText: {
      color: '#FFFFFF',
      fontWeight: '900',
      fontSize: f(15),
    },
    winOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.88)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: s(24),
    },
    winCard: {
      width: '90%',
      maxWidth: s(680),
      borderRadius: s(28),
      paddingVertical: s(32),
      paddingHorizontal: s(40),
      alignItems: 'center',
      borderWidth: line(2),
    },
    winTitle: {
      fontSize: f(28),
      fontWeight: '900',
      marginBottom: s(8),
    },
    winSubtitle: {
      color: '#03DAC6',
      fontSize: f(22),
      fontWeight: '900',
      marginBottom: s(16),
      textAlign: 'center',
    },
    winStats: {
      fontSize: f(16),
      fontWeight: '700',
      marginBottom: s(24),
    },
    rankList: {
      width: '100%',
      gap: s(8),
      marginBottom: s(20),
    },
    rankRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s(12),
    },
    rankPosition: {
      fontSize: f(15),
      fontWeight: '900',
      width: s(60),
    },
    rankName: {
      flex: 1,
      fontSize: f(16),
      fontWeight: '800',
    },
    rankScore: {
      fontSize: f(14),
      fontWeight: '700',
    },
    winResetBtn: {
      backgroundColor: '#03DAC6',
      borderRadius: s(16),
      paddingVertical: s(16),
      paddingHorizontal: s(36),
      width: '100%',
      alignItems: 'center',
    },
    winResetBtnText: {
      color: '#000000',
      fontSize: f(18),
      fontWeight: '900',
    },
    pauseOverlay: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(8, 12, 20, 0.78)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 80,
    },
    pauseCard: {
      width: '88%',
      maxWidth: s(720),
      paddingVertical: s(36),
      paddingHorizontal: s(44),
      borderRadius: s(28),
      borderWidth: 2,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.5,
      shadowRadius: 24,
      elevation: 18,
    },
    pauseIconBadge: {
      width: s(84),
      height: s(84),
      borderRadius: s(42),
      backgroundColor: 'rgba(255, 183, 77, 0.22)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: s(16),
    },
    pauseIconText: {
      fontSize: f(40),
      color: '#FFB74D',
    },
    pauseTitleText: {
      fontSize: f(42),
      fontWeight: '900',
      letterSpacing: 3,
      marginBottom: s(10),
      textAlign: 'center',
    },
    pauseSubText: {
      fontSize: f(17),
      lineHeight: f(26),
      textAlign: 'center',
      marginBottom: s(24),
    },
    resumeBtn: {
      backgroundColor: '#03DAC6',
      paddingVertical: s(16),
      paddingHorizontal: s(44),
      borderRadius: s(18),
      shadowColor: '#03DAC6',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 8,
    },
    resumeBtnText: {
      color: '#000000',
      fontSize: f(20),
      fontWeight: '900',
    },
  });
