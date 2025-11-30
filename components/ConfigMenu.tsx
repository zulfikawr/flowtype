import React from "react";
import { GameConfig } from "../types";
import { Terminal, Hash, Cpu, Sliders } from "lucide-react";

interface ConfigMenuProps {
  config: GameConfig;
  setConfig: (config: GameConfig) => void;
  onStart: () => void;
  isLoading: boolean;
}

export const ConfigMenu: React.FC<ConfigMenuProps> = ({
  config,
  setConfig,
  onStart,
  isLoading,
}) => {
  const topics = [
    "Technology",
    "Nature",
    "Space",
    "History",
    "Philosophy",
    "Cyberpunk",
  ];

  return (
    <div className="flex flex-col items-start justify-center w-full max-w-4xl mx-auto px-4 font-mono">
      {/* ASCII Header */}
      <div className="mb-12 border-l-4 border-green-500 pl-6 py-2">
        <h1 className="text-6xl font-bold text-green-400 mb-2 tracking-tighter">
          FLOWTYPE_
        </h1>
        <p className="text-green-800 text-lg uppercase tracking-widest">
          &gt;&gt; Neural Interface v2.1
        </p>
      </div>

      <div className="w-full border-2 border-green-900 bg-black p-1">
        <div className="border border-green-900/50 p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column: Settings */}
          <div className="space-y-8">
            {/* Topic Selection */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-green-600 font-bold uppercase text-xs tracking-wider">
                <Hash size={14} />
                Target_Data_Set
              </label>
              <div className="grid grid-cols-2 gap-2">
                {topics.map((t) => (
                  <button
                    key={t}
                    onClick={() => setConfig({ ...config, topic: t })}
                    className={`px-2 py-2 text-left text-sm border transition-colors duration-0 ${
                      config.topic === t
                        ? "bg-green-500 text-black border-green-500 font-bold"
                        : "bg-transparent text-green-700 border-green-900 hover:border-green-500 hover:text-green-400"
                    }`}
                  >
                    {config.topic === t ? "> " : ""}
                    {t.toUpperCase()}
                  </button>
                ))}
                <input
                  type="text"
                  placeholder="CUSTOM_INPUT..."
                  className="px-2 py-2 text-sm bg-black border border-green-900 text-green-400 focus:outline-none focus:border-green-400 placeholder-green-900 uppercase"
                  onChange={(e) =>
                    setConfig({ ...config, topic: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Difficulty */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-green-600 font-bold uppercase text-xs tracking-wider">
                <Cpu size={14} />
                Process_Complexity
              </label>
              <div className="flex gap-2">
                {(["easy", "normal", "hard"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setConfig({ ...config, difficulty: mode })}
                    className={`flex-1 px-4 py-2 text-sm uppercase border transition-all ${
                      config.difficulty === mode
                        ? "bg-green-900/30 text-green-400 border-green-400 shadow-[0_0_10px_rgba(74,222,128,0.2)]"
                        : "text-green-800 border-green-900 hover:text-green-500"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Modifiers */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-green-600 font-bold uppercase text-xs tracking-wider">
                <Sliders size={14} />
                Syntax_Modifiers
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() =>
                    setConfig({
                      ...config,
                      allowCapitalization: !config.allowCapitalization,
                    })
                  }
                  className={`flex items-center gap-3 text-sm p-2 border ${config.allowCapitalization ? "border-green-500 text-green-400" : "border-green-900 text-green-800"}`}
                >
                  <span className="font-bold">
                    [{config.allowCapitalization ? "X" : " "}]
                  </span>{" "}
                  CAPITALIZATION
                </button>

                <button
                  onClick={() =>
                    setConfig({
                      ...config,
                      includePunctuation: !config.includePunctuation,
                    })
                  }
                  className={`flex items-center gap-3 text-sm p-2 border ${config.includePunctuation ? "border-green-500 text-green-400" : "border-green-900 text-green-800"}`}
                >
                  <span className="font-bold">
                    [{config.includePunctuation ? "X" : " "}]
                  </span>{" "}
                  PUNCTUATION
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Execute */}
          <div className="flex flex-col justify-between border-l border-green-900/30 pl-8">
            <div className="space-y-6">
              <h3 className="text-green-400 font-bold uppercase text-sm border-b border-green-900 pb-2">
                System_Instructions
              </h3>
              <ul className="space-y-3 text-green-700 text-xs uppercase tracking-wide">
                <li className="flex items-center gap-3">
                  <span className="bg-green-900 text-black px-1 font-bold">
                    TAB
                  </span>
                  <span>:: RAPID_REBOOT</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="bg-green-900 text-black px-1 font-bold">
                    ESC
                  </span>
                  <span>:: ABORT_SEQUENCE</span>
                </li>
              </ul>

              <div className="mt-8 p-4 border border-dashed border-green-900/50 text-xs text-green-800">
                <p className="mb-2">&gt;&gt; TARGET_CONFIG:</p>
                <p>MODE: {config.difficulty.toUpperCase()}</p>
                <p>
                  CASE:{" "}
                  {config.allowCapitalization ? "SENSITIVE" : "LOWER_ONLY"}
                </p>
                <p>
                  PUNC: {config.includePunctuation ? "ENABLED" : "DISABLED"}
                </p>
              </div>
            </div>

            <button
              onClick={onStart}
              disabled={isLoading}
              className={`group w-full mt-8 py-6 text-lg font-bold border-2 transition-all duration-100 flex items-center justify-center gap-3 uppercase tracking-widest ${
                isLoading
                  ? "border-green-900 text-green-900 cursor-not-allowed"
                  : "border-green-500 text-green-500 hover:bg-green-500 hover:text-black"
              }`}
            >
              {isLoading ? (
                <span className="animate-pulse">INITIALIZING...</span>
              ) : (
                <>
                  <Terminal className="w-5 h-5" />
                  Initialize_Test
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
