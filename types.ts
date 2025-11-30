export enum GameState {
  IDLE = "IDLE",
  LOADING = "LOADING",
  PLAYING = "PLAYING",
  FINISHED = "FINISHED",
}

export interface GameConfig {
  topic: string;
  duration: number; // in seconds, 0 for "text length" mode
  difficulty: "easy" | "normal" | "hard";
  includePunctuation: boolean;
  allowCapitalization: boolean;
}

export interface GameStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  extraChars: number;
  missedChars: number;
  timeElapsed: number;
}

export interface WpmPoint {
  time: number;
  wpm: number;
  raw: number;
  errors: number;
}
