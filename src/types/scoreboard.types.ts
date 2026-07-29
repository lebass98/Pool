export type GameType = '3ball' | '4ball';

export interface Player {
  id: string;
  name: string;
  targetScore: number;
  currentScore: number;
  highRun: number;
  currentInningScore: number;
  /** 목표 점수 달성 순위(1등부터). null이면 아직 진행 중 */
  finishRank: number | null;
}

export interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  isFinished: boolean;
  gameType: GameType; // 3구 vs 4구
  playerCount: number; // 2 ~ 8명 선택 지원
  currentTurnIndex: number;
  inning: number;
  elapsedTime: number;
  winnerId: string | null;
  /** 3인 이상 경기에서 마지막까지 목표에 도달하지 못한 꼴지 */
  loserId: string | null;
  /** 목표 점수를 달성한 순서대로 쌓이는 선수 id 목록 */
  rankings: string[];
}

export interface RegisteredPlayer {
  id: string;
  name: string;
  targetScore: number;
}

export interface GameHistoryStep {
  players: Player[];
  gameState: GameState;
}
