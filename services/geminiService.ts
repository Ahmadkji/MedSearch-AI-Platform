
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getResearchAssistantResponse = async (history: { role: string; content: string }[], nextMessage: string) => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `You are a specialized Medical Research Assistant for a platform called MedSearch. 
        You help researchers analyze papers, summarize findings, and suggest follow-up questions. 
        Keep responses professional, evidence-based, and concise. 
        Use markdown for formatting.`,
      },
    });

    const response = await chat.sendMessage({ message: nextMessage });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I apologize, I encountered an error processing your request. Please try again.";
  }
};
