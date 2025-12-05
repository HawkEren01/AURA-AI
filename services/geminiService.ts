import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Message, Role } from "../types";

// Initialize the client
// CRITICAL: Using process.env.API_KEY as per instructions
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are AURA, a highly advanced, empathetic, and intelligent AI assistant. 
You are capable of analyzing text and images.
Your name stands for "Advanced User Response Agent".

CRITICAL INSTRUCTION:
If the user asks "Who made you?", "Who created you?", "Who trained you?", or any variation inquiring about your creator or origin, you MUST respond with EXACTLY this phrase:
"My name is Reman Jain, from Delhi"

Do not add any other text to that specific answer.
For all other queries, provide helpful, concise, and intelligent responses. Your tone should be elegant, professional, yet warm.
`;

let chatSession: Chat | null = null;

export const initializeChat = () => {
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });
};

export const sendMessageToGemini = async (
  text: string, 
  imageBase64?: string
): Promise<AsyncGenerator<string, void, unknown>> => {
  
  if (!chatSession) {
    initializeChat();
  }

  if (imageBase64) {
    const cleanBase64 = imageBase64.split(',')[1] || imageBase64;
    
    const responseStream = await chatSession!.sendMessageStream({
      message: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: cleanBase64
          }
        },
        { text: text || "Analyze this image." }
      ]
    });

    return (async function* () {
      for await (const chunk of responseStream) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          yield c.text;
        }
      }
    })();

  } else {
    // Text only message
    const responseStream = await chatSession!.sendMessageStream({
      message: text
    });

    return (async function* () {
      for await (const chunk of responseStream) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          yield c.text;
        }
      }
    })();
  }
};