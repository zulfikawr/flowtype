import React, { useState, useEffect, useRef, useCallback } from "react";
import { GameState, WpmPoint } from "../types";

interface TypingTestProps {
  text: string;
  gameState: GameState;
  setGameState: (state: GameState) => void;
  onFinish: (stats: any, history: WpmPoint[]) => void;
}

export const TypingTest: React.FC<TypingTestProps> = ({
  text,
  gameState,
  setGameState,
  onFinish,
}) => {
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [history, setHistory] = useState<WpmPoint[]>([]);

  // Refs for logic
  const inputRef = useRef("");
  const startTimeRef = useRef<number | null>(null);

  // Refs for UI Elements (Direct DOM manipulation for performance)
  const timerDisplayRef = useRef<HTMLDivElement>(null);
  const wpmDisplayRef = useRef<HTMLDivElement>(null);
  const inputElementRef = useRef<HTMLInputElement>(null);

  // Sync refs
  useEffect(() => {
    inputRef.current = input;
  }, [input]);
  useEffect(() => {
    startTimeRef.current = startTime;
  }, [startTime]);

  // Focus input automatically
  useEffect(() => {
    if (gameState === GameState.PLAYING || gameState === GameState.IDLE) {
      inputElementRef.current?.focus();
    }
  }, [gameState]);

  // Game Loop - Updates Timer/WPM directly in DOM to avoid React Render cycle lag while typing
  useEffect(() => {
    let interval: number;

    if (gameState === GameState.PLAYING) {
      interval = window.setInterval(() => {
        const start = startTimeRef.current;
        if (!start) return;

        const now = Date.now();
        const durationMin = (now - start) / 60000;
        const currentTimer = Math.floor((now - start) / 1000);

        // Calculate WPM
        const length = inputRef.current.length;
        const words = length / 5;
        const currentWpm =
          durationMin > 0 ? Math.round(words / durationMin) : 0;

        // Direct DOM update for performance
        if (timerDisplayRef.current)
          timerDisplayRef.current.innerText = currentTimer.toString();
        if (wpmDisplayRef.current)
          wpmDisplayRef.current.innerText = currentWpm.toString();

        // Update history state less frequently (every 1s)
        setHistory((prev) => {
          const last = prev[prev.length - 1];
          if (!last || last.time !== currentTimer) {
            return [
              ...prev,
              {
                time: currentTimer,
                wpm: currentWpm,
                raw: currentWpm,
                errors: 0,
              },
            ];
          }
          return prev;
        });
      }, 100); // 100ms update rate for smoothness
    }

    return () => clearInterval(interval);
  }, [gameState]);

  const calculateStats = useCallback(() => {
    if (!startTime) return;

    const endTime = Date.now();
    const durationMin = (endTime - startTime) / 60000;

    let correctChars = 0;
    let incorrectChars = 0;

    for (let i = 0; i < input.length; i++) {
      if (input[i] === text[i]) {
        correctChars++;
      } else {
        incorrectChars++;
      }
    }

    const missedChars = text.length - input.length;
    const accuracy = Math.round((correctChars / input.length) * 100) || 100;
    const finalWpm = Math.round(correctChars / 5 / durationMin);
    const rawWpm = Math.round(input.length / 5 / durationMin);

    onFinish(
      {
        wpm: finalWpm,
        rawWpm,
        accuracy,
        correctChars,
        incorrectChars,
        missedChars,
        extraChars: 0,
        timeElapsed: (endTime - startTime) / 1000,
      },
      history,
    );
  }, [input, text, startTime, onFinish, history]);

  // Handle Input
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (gameState === GameState.IDLE) {
      setGameState(GameState.PLAYING);
      setStartTime(Date.now());
    }

    // Prevent typing beyond text length
    if (val.length <= text.length) {
      setInput(val);

      if (val.length === text.length) {
        // Small delay to show final character before finishing
        setTimeout(() => {
          setGameState(GameState.FINISHED);
        }, 50);
      }
    }
  };

  useEffect(() => {
    if (gameState === GameState.FINISHED) {
      calculateStats();
    }
  }, [gameState, calculateStats]);

  // Render Logic
  const renderText = () => {
    const words = text.split(" ");
    let globalIndex = 0;

    return words.map((word, wIndex) => {
      const wordChars = word.split("");
      const wordElements = wordChars.map((char, cIndex) => {
        const index = globalIndex + cIndex;
        const inputChar = input[index];
        const isTyped = index < input.length;
        const isCorrect = isTyped && inputChar === char;
        const isError = isTyped && !isCorrect;

        // Cursor logic
        const isCursor =
          index === input.length && gameState !== GameState.FINISHED;

        return (
          <span
            key={`${wIndex}-${cIndex}`}
            className={`relative text-2xl ${isCorrect ? "text-green-400" : isError ? "text-red-500 bg-red-900/40" : "text-green-900"}`}
          >
            {isCursor && (
              <span className="absolute inset-0 bg-green-400 animate-[blink_1s_step-end_infinite] -z-10 block opacity-60"></span>
            )}
            {char}
          </span>
        );
      });

      // Add space handling
      globalIndex += word.length;
      let spaceEl = null;

      if (wIndex < words.length - 1) {
        const index = globalIndex;
        const isTyped = index < input.length;
        const isError = isTyped && input[index] !== " ";
        const isCursor =
          index === input.length && gameState !== GameState.FINISHED;

        spaceEl = (
          <span
            key={`space-${wIndex}`}
            className={`relative text-2xl inline-block w-[0.6em] h-[1.5em] align-middle ${isError ? "bg-red-900/40" : ""}`}
          >
            {isCursor && (
              <span className="absolute inset-0 bg-green-400 animate-[blink_1s_step-end_infinite] -z-10 block opacity-60"></span>
            )}
          </span>
        );
        globalIndex++;
      }

      // Use Flexbox for layout to ensure words stay together but wrap naturally
      return (
        <div key={wIndex} className="flex">
          {wordElements}
          {spaceEl}
        </div>
      );
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[60vh] px-8 font-mono">
      {/* Terminal Header */}
      <div className="w-full flex justify-between items-end mb-12 border-b-2 border-green-900 pb-2">
        <div className="text-green-700 text-sm uppercase tracking-widest">
          {gameState === GameState.PLAYING
            ? ">> EXEC_PROCESS: TYPING"
            : ">> AWAITING_INPUT"}
        </div>
        <div className="flex gap-12 font-bold">
          <div className="text-right">
            <div className="text-[10px] text-green-700 uppercase">
              T_ELAPSED
            </div>
            <div className="text-3xl text-green-400">
              <span ref={timerDisplayRef}>0</span>
              <span className="text-sm">s</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-green-700 uppercase">VELOCITY</div>
            <div className="text-3xl text-green-400">
              <span ref={wpmDisplayRef}>0</span>
              <span className="text-sm">wpm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Typing Area */}
      <div
        className="relative w-full outline-none font-mono"
        onClick={() => inputElementRef.current?.focus()}
      >
        {/* Text Container: Flex Wrap handles the "newline" issue properly */}
        <div className="flex flex-wrap items-start content-start gap-y-2 pointer-events-none select-none text-glow">
          {renderText()}
        </div>

        <input
          ref={inputElementRef}
          type="text"
          value={input}
          onChange={handleInput}
          className="absolute inset-0 opacity-0 cursor-default"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          autoComplete="off"
          disabled={gameState === GameState.FINISHED}
        />
      </div>

      <div className="mt-20 text-green-800 flex gap-6 text-xs uppercase tracking-widest">
        <div>[TAB] RESTART_SEQ</div>
      </div>
    </div>
  );
};
