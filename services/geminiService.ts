import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Sends a message to the Gemini API.
 */
export const sendMessageToGemini = async (
  prompt: string,
  imageBase64?: string,
  systemInstruction?: string
): Promise<string> => {
  try {
    const modelName = 'gemini-2.5-flash';

    let contents: any;

    if (imageBase64) {
      const cleanBase64 = imageBase64.split(',')[1] || imageBase64;
      const mimeTypeMatch = imageBase64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
      const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg';

      contents = {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64,
            },
          },
          {
            text: prompt,
          },
        ],
      };
    } else {
      contents = { parts: [{ text: prompt }] };
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    if (response && response.text) {
      return response.text;
    } else {
      throw new Error("No response text generated");
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};