import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScaleFn, useScale } from '@/constants/layout';
import { ThemeColors } from '@/constants/themeColors';

interface GameControlBarProps {
  isRunningTimer: boolean;
  canUndo: boolean;
  theme: ThemeColors;
  onToggleTimer: () => void;
  onFinishGamePrompt: () => void;
  onUndo: () => void;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  onResetGame: () => void;
}

export const GameControlBar: React.FC<GameControlBarProps> = ({
  isRunningTimer,
  canUndo,
  theme,
  onToggleTimer,
  onFinishGamePrompt,
  onUndo,
  onToggleTheme,
  onOpenSettings,
  onResetGame,
}) => {
  const { s, f } = useScale();
  const styles = useMemo(() => createStyles(s, f), [s, f]);

  return (
    <View style={styles.container}>
      {/* 서브 컨트롤 버튼군 - 순수 한글명 표출 */}
      <View style={styles.subControls}>
        {!isRunningTimer ? (
          /* 경기 시작 전/중지 상태: 게임 시작 버튼 1개 */
          <TouchableOpacity
            style={[styles.actionBtn, styles.startBtn]}
            onPress={onToggleTimer}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="게임 시작"
          >
            <Text style={styles.startBtnText}>게임 시작</Text>
          </TouchableOpacity>
        ) : (
          /* 경기 진행 중 상태: 일시정지 & 경기종료 2개 분리 버튼 */
          <>
            <TouchableOpacity
              style={[styles.actionBtn, styles.pauseBtn]}
              onPress={onToggleTimer}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="일시정지"
            >
              <Text style={styles.btnText}>일시정지</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.finishBtn]}
              onPress={onFinishGamePrompt}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="경기 종료"
            >
              <Text style={styles.finishBtnText}>경기종료</Text>
            </TouchableOpacity>
          </>
        )}

        {/* 되돌리기 */}
        <TouchableOpacity
          style={[
            styles.actionBtn,
            { backgroundColor: theme.badgeBg },
            !canUndo && styles.disabledBtn,
          ]}
          onPress={onUndo}
          disabled={!canUndo}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="되돌리기"
          accessibilityState={{ disabled: !canUndo }}
        >
          <Text
            style={[
              styles.btnText,
              { color: theme.textPrimary },
              !canUndo && styles.disabledText,
            ]}
          >
            되돌리기
          </Text>
        </TouchableOpacity>

        {/* 테마 모드 전환 (1테마 / 2테마 / 3테마) */}
        <TouchableOpacity
          style={[styles.actionBtn, styles.themeBtn]}
          onPress={onToggleTheme}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`현재 ${theme.themeName}, 테마 변경하기`}
        >
          <Text style={styles.btnText}>{theme.themeName || '테마 변경'}</Text>
        </TouchableOpacity>

        {/* 경기 설정 */}
        <TouchableOpacity
          style={[styles.actionBtn, styles.settingsBtn]}
          onPress={onOpenSettings}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="경기 설정 열기"
        >
          <Text style={styles.btnText}>경기 설정</Text>
        </TouchableOpacity>

        {/* 경기 리셋 */}
        <TouchableOpacity
          style={[styles.actionBtn, styles.resetBtn]}
          onPress={onResetGame}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="경기 리셋"
        >
          <Text style={styles.resetBtnText}>경기 리셋</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

/** 스타일 수치는 모두 1920 x 1080 기준 픽셀값 */
const createStyles = (s: ScaleFn, f: ScaleFn) =>
  StyleSheet.create({
    container: {
      marginTop: s(12),
    },
    subControls: {
      flexDirection: 'row',
      gap: s(10),
    },
    actionBtn: {
      flex: 1,
      paddingVertical: s(18),
      borderRadius: s(16),
      alignItems: 'center',
      justifyContent: 'center',
    },
    startBtn: {
      backgroundColor: '#03DAC6',
      flex: 1.3,
    },
    pauseBtn: {
      backgroundColor: '#FFCC80',
      flex: 1,
    },
    finishBtn: {
      backgroundColor: '#E53935',
      flex: 1.2,
    },
    themeBtn: {
      backgroundColor: '#80DEEA',
    },
    settingsBtn: {
      backgroundColor: '#B39DDB',
    },
    resetBtn: {
      backgroundColor: '#CF6679',
    },
    btnText: {
      color: '#121212',
      fontSize: f(24),
      fontWeight: '700',
    },
    startBtnText: {
      color: '#000000',
      fontSize: f(24),
      fontWeight: '800',
    },
    pauseBtnText: {
      color: '#000000',
      fontSize: f(24),
      fontWeight: '800',
    },
    finishBtnText: {
      color: '#FFFFFF',
      fontSize: f(24),
      fontWeight: '800',
    },
    resetBtnText: {
      color: '#FFFFFF',
      fontSize: f(24),
      fontWeight: '800',
    },
    disabledBtn: {
      opacity: 0.35,
    },
    disabledText: {
      opacity: 0.4,
    },
  });
