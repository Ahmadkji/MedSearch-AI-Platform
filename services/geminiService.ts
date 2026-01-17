
import { GoogleGenAI, Type } from "@google/genai";

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

export const generateNotesFromText = async (summaryText: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Transform the following medical executive summary into a list of 3-5 distinct, professional research notes. 
      Each note should have a concise title, a 1-2 sentence detailed observation, and 2-3 relevant medical tags.
      
      Summary:
      ${summaryText}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Concise title for the note" },
              content: { type: Type.STRING, description: "Detailed content of the research observation" },
              tags: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "List of 2-3 relevant clinical or methodological tags"
              }
            },
            required: ["title", "content", "tags"]
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Failed to generate notes:", error);
    return [];
  }
};
