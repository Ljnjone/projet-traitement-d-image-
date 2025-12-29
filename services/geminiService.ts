
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, RecognitionResult } from "../types";

export const analyzeFace = async (
  currentFrameBase64: string,
  authorizedUsers: UserProfile[]
): Promise<RecognitionResult> => {
  // Fix: Initializing GoogleGenAI with process.env.API_KEY directly as per SDK guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Preparation of parts for Gemini
  const parts = [];
  
  // Add authorized users' photos if they exist
  authorizedUsers.forEach((user, index) => {
    if (user.photoBase64) {
      parts.push({
        text: `Authorized Person ${index + 1}: ${user.name}`
      });
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: user.photoBase64.split(',')[1]
        }
      });
    }
  });

  // Add the current frame to identify
  parts.push({
    text: "Question: Is the person in this photo one of the authorized persons above? Or is it someone else (unknown)?"
  });
  parts.push({
    inlineData: {
      mimeType: "image/jpeg",
      data: currentFrameBase64.split(',')[1]
    }
  });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            identifiedAs: { 
              type: Type.STRING, 
              description: "The name of the authorized person or 'unknown' if not recognized." 
            },
            confidence: { 
              type: Type.NUMBER, 
              description: "Confidence level from 0 to 1." 
            },
            reasoning: { 
              type: Type.STRING, 
              description: "Brief visual reasoning for the identification." 
            }
          },
          required: ["identifiedAs", "confidence", "reasoning"]
        }
      }
    });

    // Fix: Access response.text directly (property, not a method).
    const result = JSON.parse(response.text || "{}");
    return {
      identifiedAs: result.identifiedAs || 'unknown',
      confidence: result.confidence || 0,
      reasoning: result.reasoning || "Analyse terminée."
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      identifiedAs: 'unknown',
      confidence: 0,
      reasoning: "Erreur lors de la communication avec l'IA."
    };
  }
};
