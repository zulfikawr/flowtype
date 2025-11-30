# FlowType AI

> "Programming is the art of telling another human what one wants the computer to do."

**FlowType AI** is a keyboard-first typing speed test wrapped in a retro-futuristic terminal aesthetic. Powered by Google's **Gemini AI**, it generates infinite, unique typing prompts tailored to your specific interests and difficulty preferences.

## 🚀 Features

- **AI-Generated Prompts**: Never type the same static quote twice. Enter any topic (e.g., "Cyberpunk", "Philosophy", "Quantum Mechanics") and Gemini generates a coherent paragraph for you.
- **Terminal Aesthetic**: Immersive UI with scanlines, CRT glow effects, and a monochromatic green color scheme designed for focus.
- **Deep Analytics**:
  - Real-time WPM and raw WPM tracking.
  - Accuracy percentage.
  - Character-level error analysis (Correct, Incorrect, Missed).
  - Visual performance graph over time.
- **Customizable Experience**:
  - **Difficulty Levels**: Easy (Short words), Normal (Conversational), Hard (Academic/Complex).
  - **Modifiers**: Toggle Punctuation and Capitalization.
- **Keyboard First**: Navigate the entire flow without a mouse.
  - `TAB`: Quick Restart (Reboot System)
  - `ESC`: Return to Menu (Abort Sequence)

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **AI Integration**: Google GenAI SDK (`@google/genai`)
- **Visualization**: Recharts
- **Icons**: Lucide React
- **Font**: JetBrains Mono

## 🎮 How to Use

1.  **Configure**: On the main screen, select a preset topic or type your own. Choose your difficulty and toggle modifiers.
2.  **Initialize**: Press `Enter` or click "Initialize_Test" to generate your text.
3.  **Type**: The timer starts as soon as you type the first character. Focus on accuracy and rhythm.
4.  **Analyze**: Upon completion, view your session report with detailed statistics and a velocity graph.
5.  **Reboot**: Press `TAB` to retry the same text immediately, or `ESC` to generate a new one.

## ⌨️ Shortcuts

| Key       | Action               | Context               |
| :-------- | :------------------- | :-------------------- |
| **TAB**   | Restart current test | Typing Test / Results |
| **ESC**   | Return to Main Menu  | Typing Test / Results |
| **ENTER** | Start Game           | Main Menu             |

---
