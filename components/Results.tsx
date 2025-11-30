import React from "react";
import { GameStats, WpmPoint } from "../types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { RotateCcw, Terminal } from "lucide-react";

interface ResultsProps {
  stats: GameStats;
  history: WpmPoint[];
  onRestart: () => void;
  onHome: () => void;
}

export const Results: React.FC<ResultsProps> = ({
  stats,
  history,
  onRestart,
  onHome,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in-up px-4 py-8 font-mono">
      <div className="mb-8 border-b border-green-900 pb-2">
        <h2 className="text-2xl text-green-500 uppercase tracking-widest">
          &gt;&gt; SESSION_REPORT
        </h2>
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-green-900 bg-black mb-8">
        <div className="p-6 border-r border-green-900 flex flex-col items-center justify-center gap-2">
          <div className="text-4xl font-bold text-green-400 text-glow">
            {stats.wpm}
          </div>
          <div className="text-green-800 text-xs uppercase tracking-widest">
            WPM_AVG
          </div>
        </div>

        <div className="p-6 border-r border-green-900 flex flex-col items-center justify-center gap-2">
          <div className="text-4xl font-bold text-green-400 text-glow">
            {stats.accuracy}%
          </div>
          <div className="text-green-800 text-xs uppercase tracking-widest">
            PRECISION
          </div>
        </div>

        <div className="p-6 border-r border-green-900 flex flex-col items-center justify-center gap-2">
          <div className="text-4xl font-bold text-green-400 text-glow">
            {stats.rawWpm}
          </div>
          <div className="text-green-800 text-xs uppercase tracking-widest">
            RAW_INPUT
          </div>
        </div>

        <div className="p-6 flex flex-col items-center justify-center gap-2">
          <div className="text-4xl font-bold text-green-400 text-glow">
            {Math.round(stats.timeElapsed)}s
          </div>
          <div className="text-green-800 text-xs uppercase tracking-widest">
            DURATION
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-64 bg-black border-l border-b border-green-900 p-4 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#064e3b"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              stroke="#15803d"
              tick={{ fill: "#15803d", fontSize: 10, fontFamily: "monospace" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#15803d"
              tick={{ fill: "#15803d", fontSize: 10, fontFamily: "monospace" }}
              tickLine={false}
              axisLine={false}
              domain={["dataMin - 10", "dataMax + 10"]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#000",
                borderColor: "#4ade80",
                borderWidth: "1px",
                color: "#4ade80",
                fontFamily: "monospace",
              }}
              itemStyle={{ color: "#4ade80" }}
              cursor={{ stroke: "#15803d", strokeWidth: 1 }}
            />
            <Line
              type="step"
              dataKey="wpm"
              stroke="#4ade80"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 4,
                fill: "#000",
                stroke: "#4ade80",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-6">
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-8 py-3 bg-green-900/20 hover:bg-green-500 hover:text-black border border-green-500 text-green-500 uppercase tracking-wider text-sm transition-colors"
        >
          <RotateCcw size={16} />
          <span>Restart [TAB]</span>
        </button>
        <button
          onClick={onHome}
          className="flex items-center gap-2 px-8 py-3 bg-black hover:bg-green-900/30 border border-green-800 text-green-700 hover:text-green-400 uppercase tracking-wider text-sm transition-colors"
        >
          <Terminal size={16} />
          <span>Menu [ESC]</span>
        </button>
      </div>
    </div>
  );
};
