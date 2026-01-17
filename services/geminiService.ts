
import { GoogleGenAI, Type } from "@google/genai";
import { Paper } from "../types";

// Initialize the Google GenAI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Searches PubMed for relevant medical papers using Google Search grounding.
 */
export const searchPubMed = async (query: string): Promise<Paper[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Search PubMed and reputable medical databases for the top 5 most relevant and recent research papers regarding: "${query}". 
      
      Return the results as a JSON array of objects. 
      Each object must include:
      - title: The full paper title.
      - authors: The main authors.
      - journal: The publication journal.
      - date: Month and year.
      - abstract: A concise (2-3 sentence) summary of findings.
      - citations: Estimated number of citations (integer).
      - tags: 2-3 clinical keywords.
      - url: The actual PubMed or DOI link.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              authors: { type: Type.STRING },
              journal: { type: Type.STRING },
              date: { type: Type.STRING },
              abstract: { type: Type.STRING },
              citations: { type: Type.NUMBER },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } },
              url: { type: Type.STRING }
            },
            required: ["title", "authors", "journal", "date", "abstract", "tags", "url"]
          }
        }
      }
    });

    const results = JSON.parse(response.text || "[]");
    return results.map((paper: any, index: number) => ({
      ...paper,
      id: index + 1 // Assign consistent local IDs for citation mapping
    }));
  } catch (error) {
    console.error("PubMed Search Error:", error);
    return [];
  }
};

/**
 * Generates a comprehensive executive summary from a set of papers.
 */
export const generateGlobalSummary = async (query: string, papers: Paper[]) => {
  try {
    const papersContext = papers.map(p => `[${p.id}] ${p.title}: ${p.abstract}`).join('\n\n');
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Switched to Flash to avoid 429
      contents: `Based on the following research papers found for the query "${query}", provide an executive clinical summary.
      
      Papers:
      ${papersContext}
      
      CRITICAL: Use citation markers like [1], [2], etc., throughout the text to refer to the source papers. Focus on Clinical Significance and Mechanism of Action. Structure the output into sections using markdown headers (###).`,
      config: {
        temperature: 0.3,
      }
    });
    return response.text;
  } catch (error: any) {
    console.error("Global Summary Error:", error);
    if (error?.message?.includes('429')) {
      return "Rate limit reached. Please wait a moment and try searching again.";
    }
    return "Failed to generate executive summary.";
  }
};

/**
 * Summarizes a single clinical paper abstract.
 */
export const summarizeSinglePaper = async (paper: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a clinical summary of the following paper abstract. Focus on Objectives, Key Findings, and Clinical Implications. Use bullet points and markdown headers.
      
      TITLE: ${paper.title}
      AUTHORS: ${paper.authors}
      ABSTRACT: ${paper.abstract}`,
      config: {
        temperature: 0.2,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Paper Summarization Error:", error);
    return "Could not generate summary.";
  }
};

/**
 * Generates research notes from provided text.
 */
export const generateNotesFromText = async (summaryText: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Switched to Flash to avoid 429
      contents: [{ 
        parts: [{ 
          text: `Transform the following medical executive summary into a list of 3-5 distinct, professional research notes. 
      
          CRITICAL INSTRUCTIONS:
          1. Each note should have a concise title, a 1-2 sentence detailed observation, and 2-3 relevant medical tags.
          2. PRESERVE CITATIONS: The input text contains citation markers like [1], [2], etc. You MUST include these exact markers in the note content whenever you are summarizing a point that was cited in the original text.
          3. Maintain the professional, evidence-based tone of the source.
          
          Summary:
          ${summaryText}`
        }] 
      }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Concise title for the note" },
              content: { type: Type.STRING, description: "Detailed content of the research observation with citation markers like [1]" },
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

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Failed to generate notes:", error);
    return [];
  }
};

/**
 * Handles chat interactions with the Research Assistant.
 * Includes optional context for specific paper discussions.
 */
export const getResearchAssistantResponse = async (history: { role: string; content: string }[], message: string, context?: string) => {
  try {
    const contents = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Append the current message as the last part of the contents
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const systemInstruction = `You are a professional medical research assistant. Provide evidence-based, clinical insights. Use a professional, objective tone. Use markdown headers (###) and bullet points for structure.
    
    ${context ? `IMPORTANT CONTEXT FOR THIS CONVERSATION:\n${context}\n\nWhen answering, focus on this specific paper/context provided above.` : "Provide general medical research assistance based on standard clinical knowledge."}
    
    Refer to specific findings precisely and include relevant details like sample sizes or specific outcomes if available. Use structured formatting for readability.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Switched to Flash to avoid 429
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      }
    });
    
    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error: any) {
    console.error("Research Assistant Error:", error);
    if (error?.message?.includes('429')) {
      return "The assistant is currently at its query limit. Please wait a moment.";
    }
    return "I encountered an error while processing your request. Please try again.";
  }
};
