import { useState } from 'react';
import { GameState, GameType, Player, RegisteredPlayer } from '@/types/scoreboard.types';

const INITIAL_REGISTERED_PLAYERS: RegisteredPlayer[] = [
  { id: 'p1', name: '김당구', targetScore: 20 },
  { id: 'p2', name: '박당구', targetScore: 20 },
  { id: 'p3', name: '이수구', targetScore: 18 },
  { id: 'p4', name: '최쿠션', targetScore: 15 },
  { id: 'p5', name: '정뱅크', targetScore: 15 },
  { id: 'p6', name: '강마세', targetScore: 15 },
  { id: 'p7', name: '조시쿠', targetScore: 15 },
  { id: 'p8', name: '윤다이', targetScore: 15 },
];

const createPlayer = (
  id: string,
  name: string,
  targetScore: number
): Player => ({
  id,
  name,
  targetScore,
  currentScore: 0,
  currentInningScore: 0,
  highRun: 0,
  finishRank: null,
});

export const useScoreboard = () => {
  const [registeredPlayers, setRegisteredPlayers] = useState<RegisteredPlayer[]>(
    INITIAL_REGISTERED_PLAYERS
  );

  const [gameType, setGameTypeState] = useState<GameType>('3ball');

  const [players, setPlayers] = useState<Player[]>([
    createPlayer('p1', '김당구', 20),
    createPlayer('p2', '박당구', 20),
  ]);

  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isPaused: false,
    isFinished: false,
    gameType: '3ball',
    playerCount: 2,
    currentTurnIndex: 0,
    inning: 1,
    elapsedTime: 0,
    winnerId: null,
    loserId: null,
    rankings: [],
  });

  const [history, setHistory] = useState<
    { players: Player[]; gameState: GameState }[]
  >([]);

  const saveHistory = () => {
    setHistory((prev) => [
      ...prev,
      {
        players: JSON.parse(JSON.stringify(players)),
        gameState: { ...gameState },
      },
    ]);
  };

  // 3구 / 4구 종목 변경
  const setGameType = (type: GameType) => {
    setGameTypeState(type);
    setGameState((prev) => ({ ...prev, gameType: type }));

    // 종목에 맞춘 기본 목표 점수 보정 (4구: 100점, 3구: 20점)
    const defaultTarget = type === '4ball' ? 100 : 20;
    setPlayers((prev) =>
      prev.map((p) => ({
        ...p,
        targetScore: defaultTarget,
      }))
    );
  };

  // 개별 선수 목표 점수(핸디) 직접 변경
  const updatePlayerTargetScore = (playerIndex: number, delta: number) => {
    setPlayers((prev) =>
      prev.map((p, idx) => {
        if (idx !== playerIndex) return p;
        const newTarget = Math.max(1, p.targetScore + delta);
        return { ...p, targetScore: newTarget };
      })
    );
  };

  // 등록 선수 추가
  const addRegisteredPlayer = (name: string, targetScore: number) => {
    const finalName = name.trim() || '선수';
    const newId = `p_${Date.now()}`;
    const newPlayer: RegisteredPlayer = { id: newId, name: finalName, targetScore };
    setRegisteredPlayers((prev) => [...prev, newPlayer]);
  };

  // 등록 선수 삭제
  const deleteRegisteredPlayer = (id: string) => {
    setRegisteredPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  // 경기 인원 및 출전 선수 변경 (2명 ~ 최대 8명)
  const selectPlayersForGame = (selectedPlayerIds: string[]) => {
    const activeRegistered = selectedPlayerIds
      .map((id) => registeredPlayers.find((r) => r.id === id))
      .filter((r): r is RegisteredPlayer => r !== undefined);

    if (activeRegistered.length < 2) return;

    const defaultTarget = gameType === '4ball' ? 100 : 20;

    const newPlayers: Player[] = activeRegistered.map((r) =>
      createPlayer(r.id, r.name, r.targetScore || defaultTarget)
    );

    setPlayers(newPlayers);
    setGameState({
      isPlaying: false,
      isPaused: false,
      isFinished: false,
      gameType,
      playerCount: newPlayers.length,
      currentTurnIndex: 0,
      inning: 1,
      elapsedTime: 0,
      winnerId: null,
      loserId: null,
      rankings: [],
    });
    setHistory([]);
  };

  /**
   * 다음 공격 순서를 찾는다. 목표 점수를 달성해 턴에서 빠진 선수는 건너뛴다.
   * 남은 선수가 없으면 null.
   */
  const findNextTurnIndex = (list: Player[], fromIndex: number) => {
    const count = list.length;
    for (let step = 1; step <= count; step += 1) {
      const idx = (fromIndex + step) % count;
      if (list[idx].finishRank === null) {
        return { index: idx, wrapped: idx <= fromIndex };
      }
    }
    return null;
  };

  /**
   * 점수 변동 후 달성 순위 / 종료 여부를 다시 계산한다.
   *
   * - 2인 경기: 한 명이 목표에 도달하면 즉시 종료
   * - 3인 이상: 목표에 도달한 선수는 턴에서 빠지고, 마지막 한 명(꼴지)이
   *   남을 때까지 진행 (N-1명이 달성하면 종료)
   */
  const applyScoreChange = (playerIndex: number, delta: number) => {
    const prevPlayers = players;
    const target = prevPlayers[playerIndex];
    if (!target) return;

    const newScore = Math.max(0, target.currentScore + delta);
    const newInningScore = Math.max(0, target.currentInningScore + delta);

    const reachedTarget = newScore >= target.targetScore;
    const alreadyFinished = target.finishRank !== null;

    // 순위 목록 갱신 (달성 시 추가, 점수 하락으로 미달 시 제거)
    let rankings = [...gameState.rankings];
    if (reachedTarget && !alreadyFinished) {
      rankings = [...rankings, target.id];
    } else if (!reachedTarget && alreadyFinished) {
      rankings = rankings.filter((id) => id !== target.id);
    }

    const rankOf = (id: string) => {
      const at = rankings.indexOf(id);
      return at === -1 ? null : at + 1;
    };

    const nextPlayers = prevPlayers.map((p, idx) => {
      if (idx !== playerIndex) {
        return { ...p, finishRank: rankOf(p.id) };
      }
      return {
        ...p,
        currentScore: newScore,
        currentInningScore: newInningScore,
        highRun: Math.max(p.highRun, newInningScore),
        finishRank: rankOf(p.id),
      };
    });

    const totalCount = nextPlayers.length;
    // 2인이면 1명, 3인 이상이면 N-1명이 달성했을 때 종료
    const finishThreshold = totalCount - 1;
    const isFinished = rankings.length >= finishThreshold;

    const remaining = nextPlayers.filter((p) => p.finishRank === null);
    const loserId = isFinished && remaining.length === 1 ? remaining[0].id : null;

    // 방금 목표 달성해 턴에서 빠졌다면 다음 선수로 자동 이동
    let nextTurnIndex = gameState.currentTurnIndex;
    let nextInning = gameState.inning;

    if (
      !isFinished &&
      reachedTarget &&
      !alreadyFinished &&
      playerIndex === gameState.currentTurnIndex
    ) {
      const next = findNextTurnIndex(nextPlayers, gameState.currentTurnIndex);
      if (next) {
        nextTurnIndex = next.index;
        if (next.wrapped) nextInning += 1;
      }
    }

    setPlayers(nextPlayers);
    setGameState((prev) => ({
      ...prev,
      currentTurnIndex: nextTurnIndex,
      inning: nextInning,
      isFinished,
      winnerId: rankings.length > 0 ? rankings[0] : null,
      loserId,
      rankings,
    }));
  };

  // 득점 처리 (+1 / -1)
  const addScore = (playerIndex: number, delta: number) => {
    if (gameState.isFinished) return;
    // 이미 목표를 달성해 턴에서 빠진 선수는 추가 득점 불가 (되돌리기 위한 -1은 허용)
    if (players[playerIndex]?.finishRank !== null && delta > 0) return;

    saveHistory();
    applyScoreChange(playerIndex, delta);
  };

  // 수동 경기 종료
  const finishGame = () => {
    // 이미 목표를 달성한 순위를 우선하고, 나머지는 현재 점수 기준으로 정렬
    const ranked = [...players].sort((a, b) => {
      if (a.finishRank !== null && b.finishRank !== null) {
        return a.finishRank - b.finishRank;
      }
      if (a.finishRank !== null) return -1;
      if (b.finishRank !== null) return 1;
      return b.currentScore - a.currentScore;
    });

    setGameState((prev) => ({
      ...prev,
      isFinished: true,
      winnerId: ranked[0]?.id ?? null,
      loserId: players.length >= 3 ? ranked[ranked.length - 1]?.id ?? null : null,
    }));
  };

  // 턴 넘기기 (달성자를 건너뛰는 N인 순환 & 이닝 자동 증가)
  const endTurn = () => {
    if (gameState.isFinished) return;

    const next = findNextTurnIndex(players, gameState.currentTurnIndex);
    if (!next) return;

    saveHistory();

    setPlayers((prev) =>
      prev.map((player, idx) =>
        idx === gameState.currentTurnIndex
          ? { ...player, currentInningScore: 0 }
          : player
      )
    );

    setGameState((prev) => ({
      ...prev,
      currentTurnIndex: next.index,
      inning: next.wrapped ? prev.inning + 1 : prev.inning,
    }));
  };

  // 실행 취소 (Undo)
  const undo = () => {
    if (history.length === 0) return;
    const lastState = history[history.length - 1];
    setPlayers(lastState.players);
    setGameState(lastState.gameState);
    setHistory((prev) => prev.slice(0, prev.length - 1));
  };

  // 경기 리셋
  const resetGame = () => {
    setPlayers((prev) =>
      prev.map((p) => ({
        ...p,
        currentScore: 0,
        currentInningScore: 0,
        highRun: 0,
        finishRank: null,
      }))
    );
    setGameState({
      isPlaying: false,
      isPaused: false,
      isFinished: false,
      gameType,
      playerCount: players.length,
      currentTurnIndex: 0,
      inning: 1,
      elapsedTime: 0,
      winnerId: null,
      loserId: null,
      rankings: [],
    });
    setHistory([]);
  };

  // 2인 하위 호환용 갱신
  const updatePlayerConfig = (
    configs: { name: string; targetScore: number }[]
  ) => {
    setPlayers((prev) =>
      prev.map((p, idx) => {
        if (!configs[idx]) return p;
        return {
          ...p,
          name: configs[idx].name,
          targetScore: configs[idx].targetScore,
        };
      })
    );
  };

  // 달성 순서대로 정렬된 순위 (승자 -> 꼴지)
  const rankedPlayers = gameState.rankings
    .map((id) => players.find((p) => p.id === id))
    .filter((p): p is Player => p !== undefined);

  return {
    gameType,
    registeredPlayers,
    players,
    gameState,
    rankedPlayers,
    canUndo: history.length > 0,
    setGameType,
    updatePlayerTargetScore,
    addRegisteredPlayer,
    deleteRegisteredPlayer,
    selectPlayersForGame,
    addScore,
    finishGame,
    endTurn,
    undo,
    resetGame,
    updatePlayerConfig,
  };
};
