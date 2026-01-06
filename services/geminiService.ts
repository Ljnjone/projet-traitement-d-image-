
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { UserProfile, RecognitionResult } from "../types";

export const analyzeFace = async (
  currentFrameBase64: string,
  authorizedUsers: UserProfile[]
): Promise<RecognitionResult> => {
  // Always use a new instance with the API key from process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `You are a high-security biometric gatekeeper. 
Your database contains photos of specific authorized personnel.

CRITICAL RULES:
1. Compare the 'PROBE' image against ALL 'TRAINING' images for each person.
2. If the person in the PROBE image is NOT one of the authorized individuals (even if they look slightly similar), you MUST respond with 'unknown'.
3. Be extremely sensitive to differences in facial geometry, ear shape, and hairline.
4. If confidence is below 0.85, default to 'unknown'.
5. Any person not explicitly in the training data is an INTRUDER.`;

  const parts: any[] = [];
  
  authorizedUsers.forEach((user) => {
    if (user.photosBase64.length > 0) {
      parts.push({
        text: `DATABASE SAMPLES FOR: ${user.name}`
      });
      user.photosBase64.forEach((photo) => {
        parts.push({
          inlineData: {
            mimeType: "image/jpeg",
            data: photo.split(',')[1]
          }
        });
      });
    }
  });

  parts.push({
    text: "PROBE IMAGE TO IDENTIFY: Is this person one of the authorized users above, or an 'unknown' intruder?"
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
        // Set systemInstruction in config as per current guidelines
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            identifiedAs: { 
              type: Type.STRING, 
              description: "Exact name of user or 'unknown'." 
            },
            confidence: { 
              type: Type.NUMBER, 
              description: "Confidence score (0.0 to 1.0)." 
            },
            reasoning: { 
              type: Type.STRING, 
              description: "Brief comparison of facial features vs database samples." 
            }
          },
          required: ["identifiedAs", "confidence", "reasoning"],
          propertyOrdering: ["identifiedAs", "confidence", "reasoning"]
        }
      }
    });

    // Directly access the .text property of the response object
    const result = JSON.parse(response.text || "{}");
    return {
      identifiedAs: result.identifiedAs || 'unknown',
      confidence: result.confidence || 0,
      reasoning: result.reasoning || "Analyse terminée."
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { identifiedAs: 'unknown', confidence: 0, reasoning: "Erreur technique." };
  }
};

export const generateSpeech = async (text: string): Promise<Uint8Array | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
        },
      },
    });
    
    // Access the audio data from the response part
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      // Decode base64 to Uint8Array manually as per @google/genai rules
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    }
  } catch (e) { 
    console.error(e); 
  }
  return null;
};
