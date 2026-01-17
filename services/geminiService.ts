
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

export const generateRelatedQuestions = async (query: string, summary: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on the following research query and executive summary, generate 4 highly professional, clinically relevant follow-up questions that a researcher might ask.
      
      Query: ${query}
      Summary: ${summary}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING, description: "The follow-up question text" },
              category: { type: Type.STRING, description: "Category like 'Clinical', 'Methodology', or 'Safety'" }
            },
            required: ["question", "category"]
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Failed to generate related questions:", error);
    return [
      { question: "What are the long-term safety implications beyond 52 weeks?", category: "Safety" },
      { question: "How do these results compare across different age demographics?", category: "Clinical" },
      { question: "Are there emerging JAK inhibitors with higher selectivity?", category: "Methodology" }
    ];
  }
};

export const generateDiscoveryAnswer = async (question: string, context: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `As a medical research assistant, provide a concise, expert answer to this follow-up question based on the provided context. 
      Limit the response to 2-3 short, informative paragraphs.
      
      Question: ${question}
      Context: ${context}`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Discovery Answer Error:", error);
    return "I'm unable to generate a deep-dive answer at this moment. Please try again or use the Research Assistant sidebar.";
  }
};
