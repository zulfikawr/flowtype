import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { GameConfig } from "../types";

// Fallback text if API key is missing or completely fails
const FALLBACK_TEXT =
  "The quick brown fox jumps over the lazy dog. Programming is the art of telling another human what one wants the computer to do. Simplicity is the soul of efficiency.";

export const generateTypingText = async (
  config: GameConfig,
): Promise<string> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.warn("No API_KEY found. Using fallback.");
    return FALLBACK_TEXT;
  }

  const ai = new GoogleGenAI({ apiKey });

  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      // 1. Construct Prompt
      const seed = Date.now() + Math.random();
      const topic = config.topic || "technology";
      let styleInstruction = "";

      switch (config.difficulty) {
        case "easy":
          styleInstruction =
            "Use simple, short, high-frequency words. Avoid complex sentences. Grade level: 3.";
          break;
        case "hard":
          styleInstruction =
            "Use sophisticated, academic, and complex vocabulary. Use longer words and varied sentence structures. Grade level: College.";
          break;
        case "normal":
        default:
          styleInstruction =
            "Use standard, conversational English. Clear and articulate.";
          break;
      }

      // If punctuation is off, we tell the model, but we also enforce it via regex later
      // Asking the model helps structure the text better for no-punctuation flow
      const punctuationNote = config.includePunctuation
        ? ""
        : "Write loosely connected phrases that don't rely heavily on punctuation.";

      const prompt = `Write a coherent, interesting paragraph about ${topic}. 
      Style Instructions: ${styleInstruction} ${punctuationNote}
      Length: 40-50 words. 
      Format: Return ONLY the raw plain text. No Markdown. No Title. No "Here is the text".
      RandomSeed: ${seed}`;

      // 2. Call API with Safety Settings disabled
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          temperature: 0.9,
          safetySettings: [
            {
              category: HarmCategory.HARM_CATEGORY_HARASSMENT,
              threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
              threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
              threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
              threshold: HarmBlockThreshold.BLOCK_NONE,
            },
          ],
        },
      });

      // 3. Extract Text safely
      let text = response.text;
      if (!text && response.candidates && response.candidates.length > 0) {
        const parts = response.candidates[0].content?.parts;
        if (parts && parts.length > 0) {
          text = parts[0].text || "";
        }
      }

      // 4. Clean Text & Apply Modifiers
      if (text) {
        text = text
          .trim()
          .replace(/^```(typescript|javascript|ts|js|text)?\n?/i, "")
          .replace(/\n?```$/i, "")
          .replace(/\s+/g, " ")
          .trim();

        // Apply Capitalization Logic
        if (!config.allowCapitalization) {
          text = text.toLowerCase();
        }

        // Apply Punctuation Logic
        if (!config.includePunctuation) {
          // Remove punctuation characters: . , ; : ' " ? ! - ( )
          // We preserve spaces
          text = text
            .replace(/[.,;:'"?!()[\]{}—\-]/g, "")
            .replace(/\s+/g, " ") // Clean up any double spaces left by removal
            .trim();
        }

        if (text.length > 20) {
          return text;
        }
      }

      console.warn(`Attempt ${attempts + 1} yielded invalid text:`, text);
    } catch (error) {
      console.error(`Gemini API Error (Attempt ${attempts + 1}):`, error);
    }
    attempts++;
  }

  console.error("All attempts failed. Returning fallback text.");
  return FALLBACK_TEXT;
};
