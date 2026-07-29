import React, { useMemo } from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { ScaleFn, useScale } from '@/constants/layout';
import { ThemeColors } from '@/constants/themeColors';
import { GameType, Player, RegisteredPlayer } from '@/types/scoreboard.types';

const ball3CardBgImage = require('../../../assets/images/billiards_3ball_bg.png');
const ball4CardBgImage = require('../../../assets/images/billiards_4ball_bg.png');

interface StartLandingScreenProps {
  theme: ThemeColors;
  tableNumber: string;
  gameType: GameType;
  currentPlayerCount: number;
  players: Player[];
  registeredPlayers: RegisteredPlayer[];
  onSelectGameType: (type: GameType) => void;
  onSelectPlayerCount: (count: number) => void;
  onUpdateTargetScore: (playerIndex: number, delta: number) => void;
  onOpenSettings: () => void;
  onStartGame: () => void;
  onToggleTheme: () => void;
}

export const StartLandingScreen: React.FC<StartLandingScreenProps> = ({
  theme,
  tableNumber,
  gameType,
  currentPlayerCount,
  players,
  onSelectGameType,
  onSelectPlayerCount,
  onUpdateTargetScore,
  onOpenSettings,
  onStartGame,
  onToggleTheme,
}) => {
  const { s, f, line } = useScale();
  const styles = useMemo(() => createStyles(s, f, line), [s, f, line]);

  const deltaUnit = gameType === '4ball' ? 10 : 1;
  const count = players.length;
  const isMultiRow = count >= 5;

  return (
    <View style={styles.fullContainer}>
      {/* AR HUD Edge Corner Brackets */}
      <View style={[styles.hudCorner, styles.hudTopLeft]} pointerEvents="none" />
      <View style={[styles.hudCorner, styles.hudTopRight]} pointerEvents="none" />
      <View style={[styles.hudCorner, styles.hudBottomLeft]} pointerEvents="none" />
      <View style={[styles.hudCorner, styles.hudBottomRight]} pointerEvents="none" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
      {/* 우측 상단 테마 모드 선택 버튼 */}
      <View style={styles.topRightHeaderRow}>
        <TouchableOpacity
          style={[styles.topRightThemeBtn, !theme.isDark && styles.lightTopRightThemeBtn]}
          onPress={onToggleTheme}
          activeOpacity={0.8}
        >
          <Text style={[styles.topRightThemeBtnText, !theme.isDark && { color: theme.textAccent }]}>
            🎨 {theme.themeName}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 2. 당구 종목 선택 (visionOS Glass Panel & Spatial Glow Cards) */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionTitleRow}>
          <View style={[styles.sectionAccentLine, !theme.isDark && { backgroundColor: theme.textAccent }]} />
          <Text style={[styles.sectionTitle, !theme.isDark && { color: theme.textSecondary }]}>
            GAME MODE SELECT
          </Text>
        </View>
        <View style={styles.gameTypeRow}>
          {/* 3구 경기 카드 */}
          {/* 3구 경기 카드 */}
          <TouchableOpacity
            style={[
              styles.gameTypeCardContainer,
              gameType === '3ball'
                ? (theme.isDark ? styles.activeBall3CardContainer : styles.lightActiveBall3CardContainer)
                : (theme.isDark ? styles.inactiveCardContainer : styles.lightInactiveCardContainer),
            ]}
            onPress={() => onSelectGameType('3ball')}
            activeOpacity={0.85}
          >
            {/* 정통 3구 당구대 6:3 배경 & 공 3개 그래픽 */}
            <View style={[StyleSheet.absoluteFill, styles.billiardsFeltBg]}>
              <View style={styles.heroBallContainer3}>
                {/* 흰색 수구 (점) */}
                <View style={[styles.heroBall, styles.whiteCueBall]}>
                  <View style={styles.heroCueRedDot} />
                </View>
                {/* 노란색 수구 (점) */}
                <View style={[styles.heroBall, styles.yellowCueBall]}>
                  <View style={styles.heroCueRedDot} />
                </View>
                {/* 빨간색 적구 */}
                <View style={[styles.heroBall, styles.redObjectBall1]} />
              </View>
            </View>

            <View
              style={[
                styles.cardOverlay,
                gameType === '3ball' && (theme.isDark ? styles.activeBall3Overlay : styles.lightActiveBall3Overlay),
                !theme.isDark && styles.lightCardOverlay,
              ]}
            >
              <View style={[styles.hudReticleTopRight, !theme.isDark && { borderColor: 'rgba(2, 132, 199, 0.4)' }]} />

              {gameType === '3ball' && (
                <View style={[styles.ball3CheckBadge, !theme.isDark && styles.lightBall3CheckBadge]}>
                  <Text style={[styles.ball3CheckText, !theme.isDark && { color: '#0284C7' }]}>● ACTIVE</Text>
                </View>
              )}

              <Text style={[styles.backWatermark3, !theme.isDark && { color: 'rgba(2, 132, 199, 0.08)' }]}>3</Text>

              <View style={styles.cardTextCol}>
                <View style={styles.tagRow}>
                  <View style={[styles.ball3Tag, gameType === '3ball' && styles.activeBall3Tag, !theme.isDark && styles.lightBall3Tag]}>
                    <Text style={[styles.ball3TagText, !theme.isDark && { color: gameType === '3ball' ? '#0284C7' : '#475569' }]}>3-CUSHION</Text>
                  </View>
                </View>
                <Text style={[styles.ball3Title, gameType === '3ball' && styles.activeBall3Title, !theme.isDark && (gameType === '3ball' ? styles.lightActiveBall3Title : styles.lightInactiveTitle)]}>
                  3구 경기
                </Text>
                <Text style={[styles.ball3Desc, gameType === '3ball' && styles.activeBall3Desc, !theme.isDark && (gameType === '3ball' ? styles.lightActiveDesc : styles.lightInactiveDesc)]}>
                  3쿠션 정통 경기 (기본 핸디 20점)
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* 4구 경기 카드 */}
          <TouchableOpacity
            style={[
              styles.gameTypeCardContainer,
              gameType === '4ball'
                ? (theme.isDark ? styles.activeBall4CardContainer : styles.lightActiveBall4CardContainer)
                : (theme.isDark ? styles.inactiveCardContainer : styles.lightInactiveCardContainer),
            ]}
            onPress={() => onSelectGameType('4ball')}
            activeOpacity={0.85}
          >
            {/* 정통 4구 당구대 6:3 배경 & 완전히 동일한 빨간 공 2개 + 흰공점 + 노란공점 */}
            <View style={[StyleSheet.absoluteFill, styles.billiardsFeltBg]}>
              <View style={styles.heroBallContainer4}>
                <View style={styles.heroBallRowTop}>
                  {/* 흰색 수구 (점) */}
                  <View style={[styles.heroBall, styles.whiteCueBall]}>
                    <View style={styles.heroCueRedDot} />
                  </View>
                  {/* 노란색 수구 (점) */}
                  <View style={[styles.heroBall, styles.yellowCueBall]}>
                    <View style={styles.heroCueRedDot} />
                  </View>
                </View>
                <View style={styles.heroBallRowBottom}>
                  {/* 완전 동일한 빨간 적구 1 */}
                  <View style={[styles.heroBall, styles.redObjectBall1]} />
                  {/* 완전 동일한 빨간 적구 2 */}
                  <View style={[styles.heroBall, styles.redObjectBall1]} />
                </View>
              </View>
            </View>

            <View
              style={[
                styles.cardOverlay,
                gameType === '4ball' && (theme.isDark ? styles.activeBall4Overlay : styles.lightActiveBall4Overlay),
                !theme.isDark && styles.lightCardOverlay,
              ]}
            >
              <View style={[styles.hudReticleTopRight, !theme.isDark && { borderColor: 'rgba(225, 29, 72, 0.4)' }]} />

              {gameType === '4ball' && (
                <View style={[styles.ball4CheckBadge, !theme.isDark && styles.lightBall4CheckBadge]}>
                  <Text style={[styles.ball4CheckText, !theme.isDark && { color: '#E11D48' }]}>● ACTIVE</Text>
                </View>
              )}

              <Text style={[styles.backWatermark4, !theme.isDark && { color: 'rgba(225, 29, 72, 0.08)' }]}>4</Text>

              <View style={styles.cardTextCol}>
                <View style={styles.tagRow}>
                  <View style={[styles.ball4Tag, gameType === '4ball' && styles.activeBall4Tag, !theme.isDark && styles.lightBall4Tag]}>
                    <Text style={[styles.ball4TagText, !theme.isDark && { color: gameType === '4ball' ? '#E11D48' : '#475569' }]}>4-BALL</Text>
                  </View>
                </View>
                <Text style={[styles.ball4Title, gameType === '4ball' && styles.activeBall4Title, !theme.isDark && (gameType === '4ball' ? styles.lightActiveBall4Title : styles.lightInactiveTitle)]}>
                  4구 경기
                </Text>
                <Text style={[styles.ball4Desc, gameType === '4ball' && styles.activeBall4Desc, !theme.isDark && (gameType === '4ball' ? styles.lightActiveDesc : styles.lightInactiveDesc)]}>
                  4구 친목/클럽 경기 (기본 핸디 100점)
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* 3. 경기 인원 선택 (visionOS Dynamic Glass Segmented Pills) */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionTitleRow}>
          <View style={[styles.sectionAccentLine, !theme.isDark && { backgroundColor: theme.textAccent }]} />
          <Text style={[styles.sectionTitle, !theme.isDark && { color: theme.textSecondary }]}>
            PLAYER COUNT (2 - 8 PLAYERS)
          </Text>
        </View>
        <BlurView intensity={theme.isDark ? 40 : 60} tint={theme.isDark ? 'dark' : 'light'} style={[styles.countPillsGlass, !theme.isDark && styles.lightCountPillsGlass]}>
          <View style={styles.countChipRow}>
            {[2, 3, 4, 5, 6, 7, 8].map((num) => {
              const isActive = currentPlayerCount === num;
              return (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.countChip,
                    !theme.isDark && styles.lightCountChip,
                    isActive && (theme.isDark ? styles.activeCountChip : styles.lightActiveCountChip),
                  ]}
                  onPress={() => onSelectPlayerCount(num)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.countChipText,
                      !theme.isDark && { color: theme.textSecondary },
                      isActive && (theme.isDark ? styles.activeCountChipText : styles.lightActiveCountChipText),
                    ]}
                  >
                    {num}명
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </BlurView>
      </View>

      {/* 4. 출전 선수 라인업 (Hologram Glass Cards) */}
      <View style={styles.sectionContainer}>
        <View style={styles.lineupHeaderRow}>
          <View style={styles.sectionTitleRow}>
            <View style={[styles.sectionAccentLine, !theme.isDark && { backgroundColor: theme.textAccent }]} />
            <Text style={[styles.sectionTitle, !theme.isDark && { color: theme.textSecondary }]}>
              MATCH ROSTER & HANDICAP
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.settingsChip, !theme.isDark && styles.lightSettingsChip]}
            onPress={onOpenSettings}
            activeOpacity={0.8}
          >
            <Text style={[styles.settingsChipText, !theme.isDark && { color: theme.textPrimary }]}>
              ⚙ 선수 관리 및 설정
            </Text>
          </TouchableOpacity>
        </View>

        {/* 동적 1줄 / 2줄 반응형 그리드 */}
        <View style={styles.responsiveGrid}>
          {players.map((player, idx) => {
            let cardWidthStyle: any = styles.widthFull;
            if (count === 2) cardWidthStyle = styles.widthHalf;
            else if (count === 3) cardWidthStyle = styles.widthThird;
            else if (count === 4) cardWidthStyle = styles.widthQuarter;
            else if (count === 5) {
              cardWidthStyle = idx < 3 ? styles.widthThird : styles.widthHalf;
            } else if (count === 6) {
              cardWidthStyle = styles.widthThird;
            } else if (count === 7 || count === 8) {
              cardWidthStyle = styles.widthQuarter;
            }

            return (
              <View
                key={player.id}
                style={[
                  styles.responsivePlayerCard,
                  cardWidthStyle,
                  isMultiRow && styles.multiRowCard,
                ]}
              >
                <BlurView intensity={theme.isDark ? 45 : 70} tint={theme.isDark ? 'dark' : 'light'} style={[styles.playerGlassBlur, !theme.isDark && styles.lightPlayerGlassBlur]}>
                  <View style={[styles.playerCardContent, !theme.isDark && styles.lightPlayerCardContent]}>
                    {/* 상단 순번 HUD 배지 & 선수 이름 */}
                    <View style={styles.cardHeaderRow}>
                      <View style={[styles.orderBadge, !theme.isDark && styles.lightOrderBadge]}>
                        <Text style={[styles.orderBadgeText, !theme.isDark && { color: theme.textAccent }]}>P{idx + 1}</Text>
                      </View>
                      <Text
                        numberOfLines={1}
                        style={[styles.playerName, !theme.isDark && { color: theme.textPrimary }]}
                      >
                        {player.name}
                      </Text>
                    </View>

                    {/* 하단 목표 점수(핸디) HUD Controls */}
                    <View style={styles.targetAdjustRow}>
                      <TouchableOpacity
                        style={[styles.adjustBtn, styles.minusBtn, !theme.isDark && styles.lightMinusBtn]}
                        onPress={() => onUpdateTargetScore(idx, -deltaUnit)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.minusBtnText, !theme.isDark && { color: '#DC2626' }]}>-</Text>
                      </TouchableOpacity>

                      <View style={[styles.targetScoreBox, !theme.isDark && styles.lightTargetScoreBox]}>
                        <Text style={[styles.targetScoreNum, !theme.isDark && { color: '#0F172A' }]}>
                          {player.targetScore}
                        </Text>
                        <Text style={[styles.targetScoreUnit, !theme.isDark && { color: '#0F172A' }]}>
                          PTS
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={[styles.adjustBtn, styles.plusBtn, !theme.isDark && styles.lightPlusBtn]}
                        onPress={() => onUpdateTargetScore(idx, deltaUnit)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.plusBtnText, !theme.isDark && { color: '#059669' }]}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </BlurView>
              </View>
            );
          })}
        </View>
      </View>

        {/* 5. 하단 Spatial Neon Blur Button */}
        <View style={styles.footerBox}>
          <TouchableOpacity
            style={[styles.startGameBtn, !theme.isDark && styles.lightStartGameBtn]}
            onPress={onStartGame}
            activeOpacity={0.85}
          >
            <BlurView intensity={theme.isDark ? 50 : 0} tint={theme.isDark ? 'light' : 'light'} style={[styles.btnGlassInner, !theme.isDark && styles.lightBtnGlassInner]}>
              <Text style={[styles.startGameBtnText, !theme.isDark && styles.lightStartGameBtnText]}>경기 시작</Text>
            </BlurView>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

/** 스타일 수치는 모두 1920 x 1080 기준 픽셀값 */
const createStyles = (s: ScaleFn, f: ScaleFn, line: ScaleFn) =>
  StyleSheet.create({
    fullContainer: {
      flex: 1,
      paddingHorizontal: s(24),
      paddingVertical: s(12),
      position: 'relative',
    },
    scrollContentContainer: {
      flexGrow: 1,
      justifyContent: 'space-between',
      paddingVertical: s(10),
    },
    /* AR HUD Corner Brackets */
    hudCorner: {
      position: 'absolute',
      width: s(24),
      height: s(24),
      borderColor: 'rgba(0, 242, 254, 0.45)',
      zIndex: 99,
    },
    hudTopLeft: {
      top: s(4),
      left: s(4),
      borderTopWidth: line(2),
      borderLeftWidth: line(2),
    },
    hudTopRight: {
      top: s(4),
      right: s(4),
      borderTopWidth: line(2),
      borderRightWidth: line(2),
    },
    hudBottomLeft: {
      bottom: s(4),
      left: s(4),
      borderBottomWidth: line(2),
      borderLeftWidth: line(2),
    },
    hudBottomRight: {
      bottom: s(4),
      right: s(4),
      borderBottomWidth: line(2),
      borderRightWidth: line(2),
    },
    /* visionOS Glass Header Panel */
    headerBlurGlass: {
      borderRadius: s(24),
      overflow: 'hidden',
      borderWidth: line(1),
      borderColor: 'rgba(255, 255, 255, 0.18)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: s(10) },
      shadowOpacity: 0.35,
      shadowRadius: s(20),
    },
    headerBox: {
      alignItems: 'center',
      paddingVertical: s(20),
      paddingHorizontal: s(24),
      backgroundColor: 'rgba(15, 23, 42, 0.35)',
      position: 'relative',
    },
    topRightHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginBottom: s(6),
    },
    topRightThemeBtn: {
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
      paddingHorizontal: s(16),
      paddingVertical: s(8),
      borderRadius: s(14),
      borderWidth: line(1),
      borderColor: 'rgba(255, 255, 255, 0.25)',
      zIndex: 20,
    },
    topRightThemeBtnText: {
      color: '#00F2FE',
      fontSize: f(13),
      fontWeight: '800',
    },
    hudStatusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s(6),
      marginBottom: s(4),
    },
    hudDotPulse: {
      width: s(8),
      height: s(8),
      borderRadius: s(4),
      backgroundColor: '#00F2FE',
      shadowColor: '#00F2FE',
      shadowOpacity: 0.9,
      shadowRadius: s(6),
    },
    subTitleText: {
      fontSize: f(12),
      fontWeight: '800',
      letterSpacing: s(3),
      color: '#00F2FE',
      textShadowColor: 'rgba(0, 242, 254, 0.6)',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: s(6),
    },
    mainTitleText: {
      fontSize: f(32),
      fontWeight: '900',
      letterSpacing: -s(0.5),
      marginBottom: s(8),
      color: '#FFFFFF',
    },
    tableBadge: {
      paddingHorizontal: s(18),
      paddingVertical: s(7),
      borderRadius: s(20),
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      borderWidth: line(1),
      borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    tableBadgeText: {
      fontSize: f(14),
      fontWeight: '800',
      color: '#E2E8F0',
      letterSpacing: s(0.5),
    },
    sectionContainer: {
      marginVertical: s(12),
    },
    sectionTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s(8),
      marginBottom: s(10),
    },
    sectionAccentLine: {
      width: s(4),
      height: s(16),
      borderRadius: s(2),
      backgroundColor: '#00F2FE',
    },
    sectionTitle: {
      fontSize: f(14),
      fontWeight: '800',
      letterSpacing: s(1.5),
      color: '#94A3B8',
    },
    gameTypeRow: {
      flexDirection: 'row',
      gap: s(16),
    },
    gameTypeCardContainer: {
      flex: 1,
      aspectRatio: 6 / 3,
      borderRadius: s(24),
      borderWidth: line(1.5),
      borderColor: 'rgba(255, 255, 255, 0.12)',
      overflow: 'hidden',
      position: 'relative',
    },
    inactiveCardContainer: {
      opacity: 0.6,
    },
    activeBall3CardContainer: {
      opacity: 1.0,
    },
    billiardsFeltBg: {
      backgroundColor: '#0F3826',
      justifyContent: 'center',
      alignItems: 'center',
    },
    heroBallContainer3: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s(16),
    },
    heroBallContainer4: {
      alignItems: 'center',
      gap: s(8),
    },
    heroBallRowTop: {
      flexDirection: 'row',
      gap: s(14),
    },
    heroBallRowBottom: {
      flexDirection: 'row',
      gap: s(14),
    },
    heroBall: {
      width: s(52),
      height: s(52),
      borderRadius: s(26),
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: s(6) },
      shadowOpacity: 0.6,
      shadowRadius: s(8),
      elevation: 8,
      position: 'relative',
    },
    whiteCueBall: {
      backgroundColor: '#F8FAFC',
      borderWidth: line(1),
      borderColor: '#E2E8F0',
    },
    yellowCueBall: {
      backgroundColor: '#FACC15',
      borderWidth: line(1),
      borderColor: '#EAB308',
    },
    redObjectBall1: {
      backgroundColor: '#DC2626',
      borderWidth: line(1),
      borderColor: '#B91C1C',
    },
    heroCueRedDot: {
      width: s(12),
      height: s(12),
      borderRadius: s(6),
      backgroundColor: '#DC2626',
    },
    cardOverlay: {
      flex: 1,
      paddingVertical: s(20),
      paddingHorizontal: s(24),
      justifyContent: 'flex-start',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    activeBall3Overlay: {
      backgroundColor: 'rgba(2, 132, 199, 0.4)',
    },
    activeBall4Overlay: {
      backgroundColor: 'rgba(225, 29, 72, 0.4)',
    },
    hudReticleTopRight: {
      position: 'absolute',
      top: s(10),
      right: s(10),
      width: s(14),
      height: s(14),
      borderTopWidth: line(1.5),
      borderRightWidth: line(1.5),
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    ball3CheckBadge: {
      position: 'absolute',
      top: s(12),
      right: s(14),
      backgroundColor: 'rgba(0, 242, 254, 0.2)',
      paddingHorizontal: s(10),
      paddingVertical: s(4),
      borderRadius: s(12),
      borderWidth: line(1),
      borderColor: '#00F2FE',
    },
    ball3CheckText: {
      color: '#00F2FE',
      fontSize: f(11),
      fontWeight: '900',
      letterSpacing: s(1),
    },
    ball4CheckBadge: {
      position: 'absolute',
      top: s(12),
      right: s(14),
      backgroundColor: 'rgba(255, 42, 109, 0.2)',
      paddingHorizontal: s(10),
      paddingVertical: s(4),
      borderRadius: s(12),
      borderWidth: line(1),
      borderColor: '#FF2A6D',
    },
    ball4CheckText: {
      color: '#FF2A6D',
      fontSize: f(11),
      fontWeight: '900',
      letterSpacing: s(1),
    },
    backWatermark3: {
      position: 'absolute',
      right: -s(15),
      bottom: -s(30),
      fontSize: f(170),
      fontWeight: '900',
      color: 'rgba(0, 242, 254, 0.15)',
      letterSpacing: -s(6),
    },
    backWatermark4: {
      position: 'absolute',
      right: -s(15),
      bottom: -s(30),
      fontSize: f(170),
      fontWeight: '900',
      color: 'rgba(255, 42, 109, 0.15)',
      letterSpacing: -s(6),
    },
    tagRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s(10),
      marginBottom: s(8),
    },
    ballGraphicRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s(6),
    },
    billiardBallDot: {
      width: s(16),
      height: s(16),
      borderRadius: s(8),
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.5,
      shadowRadius: 2,
      elevation: 3,
    },
    cueRedDot: {
      width: s(4),
      height: s(4),
      borderRadius: s(2),
      backgroundColor: '#DC2626',
    },
    ball3Tag: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      paddingHorizontal: s(12),
      paddingVertical: s(4),
      borderRadius: s(8),
      borderWidth: line(1),
      borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    activeBall3Tag: {
      backgroundColor: 'rgba(0, 242, 254, 0.2)',
      borderColor: '#00F2FE',
    },
    ball3TagText: {
      color: '#E2E8F0',
      fontSize: f(12),
      fontWeight: '900',
      letterSpacing: s(1),
    },
    ball4Tag: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      paddingHorizontal: s(12),
      paddingVertical: s(4),
      borderRadius: s(8),
      borderWidth: line(1),
      borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    activeBall4Tag: {
      backgroundColor: 'rgba(255, 42, 109, 0.2)',
      borderColor: '#FF2A6D',
    },
    ball4TagText: {
      color: '#E2E8F0',
      fontSize: f(12),
      fontWeight: '900',
      letterSpacing: s(1),
    },
    cardTextCol: {
      zIndex: 10,
    },
    ball3Title: {
      fontFamily: 'PretendardGOV-ExtraBold',
      fontSize: f(80),
      fontWeight: '900',
      color: '#94A3B8',
      marginBottom: s(6),
    },
    activeBall3Title: {
      fontFamily: 'PretendardGOV-ExtraBold',
      color: '#FFFFFF',
      fontSize: f(92),
      textShadowColor: 'rgba(0, 242, 254, 0.8)',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: s(10),
    },
    ball3Desc: {
      fontFamily: 'PretendardGOV-Bold',
      fontSize: f(16),
      color: '#64748B',
      fontWeight: '600',
    },
    activeBall3Desc: {
      color: '#E2E8F0',
    },
    ball4Title: {
      fontFamily: 'PretendardGOV-ExtraBold',
      fontSize: f(80),
      fontWeight: '900',
      color: '#94A3B8',
      marginBottom: s(6),
    },
    activeBall4Title: {
      fontFamily: 'PretendardGOV-ExtraBold',
      color: '#FFFFFF',
      fontSize: f(92),
      textShadowColor: 'rgba(255, 42, 109, 0.8)',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: s(10),
    },
    ball4Desc: {
      fontSize: f(16),
      color: '#64748B',
      fontWeight: '600',
    },
    activeBall4Desc: {
      color: '#E2E8F0',
    },
    /* visionOS Pills */
    countPillsGlass: {
      borderRadius: s(16),
      overflow: 'hidden',
      padding: s(6),
      borderWidth: line(1),
      borderColor: 'rgba(255, 255, 255, 0.12)',
      backgroundColor: 'rgba(15, 23, 42, 0.35)',
    },
    countChipRow: {
      flexDirection: 'row',
      gap: s(6),
    },
    countChip: {
      flex: 1,
      paddingVertical: s(14),
      borderRadius: s(14),
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    activeCountChip: {
      backgroundColor: 'rgba(0, 242, 254, 0.25)',
      borderWidth: line(1),
      borderColor: '#00F2FE',
      shadowColor: '#00F2FE',
      shadowOpacity: 0.6,
      shadowRadius: s(8),
    },
    countChipText: {
      fontSize: f(14),
      fontWeight: '700',
      color: '#94A3B8',
    },
    activeCountChipText: {
      color: '#FFFFFF',
      fontWeight: '900',
    },
    lineupHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: s(10),
    },
    settingsChip: {
      paddingHorizontal: s(16),
      paddingVertical: s(8),
      borderRadius: s(14),
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      borderWidth: line(1),
      borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    settingsChipText: {
      fontSize: f(13),
      fontWeight: '800',
      color: '#00F2FE',
    },
    responsiveGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      rowGap: s(12),
      columnGap: s(12),
      width: '100%',
      justifyContent: 'space-between',
    },
    widthFull: {
      width: '100%',
    },
    widthHalf: {
      width: '48.8%',
    },
    widthThird: {
      width: '32.1%',
    },
    widthQuarter: {
      width: '23.8%',
    },
    responsivePlayerCard: {
      borderRadius: s(18),
      overflow: 'hidden',
      borderWidth: line(1),
      borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    playerGlassBlur: {
      width: '100%',
      height: '100%',
    },
    playerCardContent: {
      padding: s(14),
      backgroundColor: 'rgba(15, 23, 42, 0.4)',
      justifyContent: 'space-between',
    },
    multiRowCard: {
      paddingVertical: 0,
    },
    cardHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s(8),
      marginBottom: s(10),
    },
    orderBadge: {
      paddingHorizontal: s(8),
      paddingVertical: s(3),
      borderRadius: s(8),
      backgroundColor: 'rgba(0, 242, 254, 0.2)',
      borderWidth: line(1),
      borderColor: '#00F2FE',
    },
    orderBadgeText: {
      color: '#00F2FE',
      fontWeight: '900',
      fontSize: f(11),
    },
    playerName: {
      fontSize: f(16),
      fontWeight: '900',
      color: '#FFFFFF',
      flex: 1,
    },
    targetAdjustRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'rgba(0, 0, 0, 0.35)',
      borderRadius: s(12),
      padding: s(6),
      borderWidth: line(1),
      borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    adjustBtn: {
      width: s(34),
      height: s(34),
      borderRadius: s(10),
      alignItems: 'center',
      justifyContent: 'center',
    },
    minusBtn: {
      backgroundColor: 'rgba(255, 42, 109, 0.3)',
      borderWidth: line(1),
      borderColor: '#FF2A6D',
    },
    plusBtn: {
      backgroundColor: 'rgba(0, 242, 254, 0.3)',
      borderWidth: line(1),
      borderColor: '#00F2FE',
    },
    minusBtnText: {
      color: '#FF2A6D',
      fontSize: f(18),
      fontWeight: '900',
    },
    plusBtnText: {
      color: '#00F2FE',
      fontSize: f(18),
      fontWeight: '900',
    },
    targetScoreBox: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: s(4),
    },
    targetScoreNum: {
      fontSize: f(18),
      fontWeight: '900',
      color: '#FFFFFF',
    },
    targetScoreUnit: {
      fontSize: f(11),
      fontWeight: '800',
      color: '#64748B',
    },
    footerBox: {
      alignItems: 'center',
      marginTop: s(14),
    },
    startGameBtn: {
      width: '100%',
      borderRadius: s(22),
      overflow: 'hidden',
      borderWidth: line(1.5),
      borderColor: '#00F2FE',
      shadowColor: '#00F2FE',
      shadowOffset: { width: 0, height: s(6) },
      shadowOpacity: 0.6,
      shadowRadius: s(18),
      elevation: 10,
    },
    btnGlassInner: {
      paddingVertical: s(20),
      alignItems: 'center',
      backgroundColor: 'rgba(0, 242, 254, 0.22)',
    },
    startGameBtnText: {
      color: '#FFFFFF',
      fontSize: f(22),
      fontWeight: '900',
      letterSpacing: s(1),
    },

    /* 테마 2 (라이트 모드 전용 화이트 아크릴 스타일) */
    lightHeaderBlurGlass: {
      borderColor: 'rgba(203, 213, 225, 0.9)',
      shadowColor: '#64748B',
      shadowOpacity: 0.1,
    },
    lightHeaderBox: {
      backgroundColor: '#FFFFFF',
    },
    lightTopRightThemeBtn: {
      backgroundColor: '#F1F5F9',
      borderColor: '#0284C7',
      borderWidth: line(1.5),
    },
    lightTableBadge: {
      backgroundColor: '#F1F5F9',
      borderColor: '#CBD5E1',
    },
    lightGameTypeCardContainer: {
      borderColor: '#CBD5E1',
    },
    lightCardOverlay: {
      backgroundColor: '#FFFFFF',
    },
    lightCountPillsGlass: {
      borderColor: '#CBD5E1',
      backgroundColor: '#FFFFFF',
    },
    lightCountChip: {
      backgroundColor: '#F1F5F9',
      borderColor: '#CBD5E1',
    },
    lightActiveCountChip: {
      backgroundColor: '#0284C7',
      borderColor: '#0284C7',
    },
    lightActiveCountChipText: {
      color: '#FFFFFF',
      fontWeight: '900',
    },
    lightSettingsChip: {
      backgroundColor: '#F1F5F9',
      borderColor: '#0284C7',
      borderWidth: line(1.5),
    },
    lightPlayerGlassBlur: {
      borderColor: '#CBD5E1',
    },
    lightPlayerCardContent: {
      backgroundColor: '#FFFFFF',
    },
    lightOrderBadge: {
      backgroundColor: '#E0F2FE',
      borderColor: '#0284C7',
    },
    lightTargetScoreBox: {
      backgroundColor: '#E2E8F0',
      borderColor: '#94A3B8',
      paddingHorizontal: s(8),
      paddingVertical: s(2),
      borderRadius: s(6),
    },
    lightMinusBtn: {
      backgroundColor: '#FEE2E2',
      borderColor: '#EF4444',
    },
    lightPlusBtn: {
      backgroundColor: '#D1FAE5',
      borderColor: '#10B981',
    },
    lightStartGameBtn: {
      borderColor: '#0284C7',
      borderWidth: line(2),
      shadowColor: '#0284C7',
      shadowOffset: { width: 0, height: s(6) },
      shadowOpacity: 0.3,
      shadowRadius: s(16),
      elevation: 10,
    },
    lightBtnGlassInner: {
      backgroundColor: '#38BDF8',
      paddingVertical: s(22),
    },
    lightStartGameBtnText: {
      color: '#0F172A',
      fontSize: f(22),
      fontWeight: '900',
      letterSpacing: s(1.5),
    },

    /* 테마 2 전용 경기 선택(3구/4구) 명확한 화이트 스타일 */
    lightActiveBall3CardContainer: {
      opacity: 1.0,
    },
    lightActiveBall4CardContainer: {
      opacity: 1.0,
    },
    lightInactiveCardContainer: {
      borderWidth: line(2),
      borderColor: '#CBD5E1',
      opacity: 0.85,
    },
    lightCardOverlay: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    lightActiveBall3Overlay: {
      backgroundColor: 'rgba(2, 132, 199, 0.25)',
    },
    lightActiveBall4Overlay: {
      backgroundColor: 'rgba(225, 29, 72, 0.25)',
    },
    lightBall3CheckBadge: {
      backgroundColor: '#FFFFFF',
      borderColor: '#FFFFFF',
    },
    lightBall4CheckBadge: {
      backgroundColor: '#FFFFFF',
      borderColor: '#FFFFFF',
    },
    lightBall3Tag: {
      backgroundColor: '#F1F5F9',
      borderColor: '#CBD5E1',
    },
    lightBall4Tag: {
      backgroundColor: '#F1F5F9',
      borderColor: '#CBD5E1',
    },
    lightActiveBall3Title: {
      color: '#FFFFFF',
      fontSize: f(92),
      fontWeight: '900',
    },
    lightActiveBall4Title: {
      color: '#FFFFFF',
      fontSize: f(92),
      fontWeight: '900',
    },
    lightInactiveTitle: {
      color: '#0F172A',
      fontSize: f(80),
      fontWeight: '900',
    },
    lightActiveDesc: {
      color: '#FFFFFF',
      fontWeight: '700',
    },
    lightInactiveDesc: {
      color: '#475569',
      fontWeight: '700',
    },
  });
