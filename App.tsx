import React, { useState, useEffect, useCallback } from "react";
import { ConfigMenu } from "./components/ConfigMenu";
import { TypingTest } from "./components/TypingTest";
import { Results } from "./components/Results";
import { GameConfig, GameState, GameStats, WpmPoint } from "./types";
import { generateTypingText } from "./services/geminiService";

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [text, setText] = useState<string>("");
  const [stats, setStats] = useState<GameStats | null>(null);
  const [history, setHistory] = useState<WpmPoint[]>([]);
  const [loading, setLoading] = useState(false);

  // This is used to force re-mounting of the TypingTest component to clear its internal state
  const [restartTrigger, setRestartTrigger] = useState(0);

  const [config, setConfig] = useState<GameConfig>({
    topic: "Technology",
    duration: 30,
    difficulty: "normal",
    includePunctuation: true,
    allowCapitalization: true,
  });

  const startGame = useCallback(async () => {
    setLoading(true);
    setGameState(GameState.LOADING);

    try {
      const newText = await generateTypingText(config);
      setText(newText);
      setGameState(GameState.IDLE);
      setRestartTrigger((prev) => prev + 1); // Ensure clean start
    } catch (e) {
      console.error("Failed to start", e);
      setText("Error generating text. Please try again.");
      setGameState(GameState.IDLE);
    } finally {
      setLoading(false);
    }
  }, [config]);

  const handleFinish = (finalStats: GameStats, finalHistory: WpmPoint[]) => {
    setStats(finalStats);
    setHistory(finalHistory);
    setGameState(GameState.FINISHED);
  };

  const resetGame = useCallback(() => {
    // Force re-mount of TypingTest to clear 'input', 'timer', etc.
    setRestartTrigger((prev) => prev + 1);
    setGameState(GameState.IDLE);
    // Note: We keep the same 'text'. This is standard "Quick Restart" behavior.
  }, []);

  const returnToMenu = () => {
    setGameState(GameState.IDLE);
    setText("");
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // TAB to Restart
      if (e.key === "Tab") {
        e.preventDefault(); // Prevent focus switch
        if (gameState !== GameState.LOADING && text) {
          resetGame();
        }
      }

      // ESC to Menu
      if (e.key === "Escape") {
        returnToMenu();
      }

      // Enter to Start (Only on Menu)
      if (e.key === "Enter" && !text && gameState === GameState.IDLE) {
        startGame();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, text, startGame, resetGame]);

  return (
    <div className="min-h-screen w-full flex flex-col relative font-mono selection:bg-green-500 selection:text-black">
      {/* Top Bar / Logo */}
      <header className="w-full p-6 flex justify-between items-center z-10">
        <div
          className="font-bold text-lg tracking-tighter text-green-600 hover:text-green-400 cursor-pointer transition-colors"
          onClick={returnToMenu}
        >
          FLOWTYPE_TERMINAL //
        </div>
        <div className="text-xs font-mono flex gap-4 uppercase tracking-widest">
          {process.env.API_KEY ? (
            <span className="text-green-500">[ CONNECTION: SECURE ]</span>
          ) : (
            <span className="text-red-500">[ CONNECTION: OFFLINE ]</span>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10">
        {/* Loading Overlay */}
        {gameState === GameState.LOADING && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black">
            <div className="text-green-500 font-mono animate-pulse text-xl">
              &gt;&gt; GENERATING_NEURAL_PATHWAYS...
            </div>
            <div className="mt-4 w-64 h-1 bg-green-900">
              <div
                className="h-full bg-green-500 animate-[width_1s_ease-in-out_infinite]"
                style={{ width: "50%" }}
              ></div>
            </div>
          </div>
        )}

        {/* Views */}
        {!text ? (
          <ConfigMenu
            config={config}
            setConfig={setConfig}
            onStart={startGame}
            isLoading={loading}
          />
        ) : gameState === GameState.FINISHED && stats ? (
          <Results
            stats={stats}
            history={history}
            onRestart={resetGame}
            onHome={returnToMenu}
          />
        ) : (
          <TypingTest
            key={restartTrigger} // CRITICAL: Forces re-mount on restart
            text={text}
            gameState={gameState}
            setGameState={setGameState}
            onFinish={handleFinish}
          />
        )}
      </main>

      {/* Footer - Only shown when in game or results (i.e. text is present) */}
      {text && (
        <footer className="w-full p-4 text-center text-green-900 text-[10px] uppercase tracking-widest z-10 border-t border-green-900/30 bg-black">
          <p>[ESC] MENU :: [TAB] REBOOT_SYSTEM</p>
        </footer>
      )}
    </div>
  );
};

export default App;
