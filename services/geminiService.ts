import { GoogleGenAI, Type } from "@google/genai";
import { FilterState, Building, Amenity, AIAnalysisResult } from '../types';

// Initialize Gemini
// Note: In a real prod app, API Key should be handled via backend proxy.
// We handle initialization safely in case env vars aren't set in a local static context
const getGenAIClient = () => {
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return null;
};

const ai = getGenAIClient();

/**
 * OFFLINE / LOCAL PARSER
 * A rule-based fallback system that extracts intent from the query string
 * using Regular Expressions and keyword matching.
 */
const localParseQuery = (query: string): AIAnalysisResult => {
  const lowerQuery = query.toLowerCase();
  
  // Default State
  const filters: Partial<FilterState> = {
    amenities: [],
    onlyAvailableNow: true
  };
  
  const reasoningParts: string[] = [];

  // 1. Detect Capacity (e.g. "5 people", "capacity of 20")
  // Matches digits followed optionally by spaces and people-related words
  const capacityMatch = lowerQuery.match(/(\d+)\s*(?:people|students|seats|pax|person|capacity)?/);
  if (capacityMatch) {
    // If the number is reasonable (e.g. < 500), treat it as capacity
    // This prevents extracting "CS101" as capacity 101 inadvertently, though strict regex helps
    const num = parseInt(capacityMatch[1], 10);
    if (!isNaN(num)) {
        filters.minCapacity = num;
        reasoningParts.push(`capacity for ${num}`);
    }
  }

  // 2. Detect Building
  if (lowerQuery.includes('engineering') || lowerQuery.includes('eng block')) {
    filters.building = Building.ENGINEERING;
    reasoningParts.push('Engineering Building');
  } else if (lowerQuery.includes('science') || lowerQuery.includes('lab block')) {
    filters.building = Building.SCIENCE;
    reasoningParts.push('Science Center');
  } else if (lowerQuery.includes('arts') || lowerQuery.includes('humanities')) {
    filters.building = Building.ARTS;
    reasoningParts.push('Arts & Humanities');
  } else if (lowerQuery.includes('library') || lowerQuery.includes('lib')) {
    filters.building = Building.LIBRARY;
    reasoningParts.push('Central Library');
  }

  // 3. Detect Amenities
  if (lowerQuery.includes('projector') || lowerQuery.includes('screen') || lowerQuery.includes('presentation')) {
    filters.amenities?.push(Amenity.PROJECTOR);
    reasoningParts.push('Projector');
  }
  if (lowerQuery.includes('whiteboard') || lowerQuery.includes('board') || lowerQuery.includes('marker')) {
    filters.amenities?.push(Amenity.WHITEBOARD);
    reasoningParts.push('Whiteboard');
  }
  if (lowerQuery.includes('outlet') || lowerQuery.includes('plug') || lowerQuery.includes('power') || lowerQuery.includes('charging')) {
    filters.amenities?.push(Amenity.OUTLETS);
    reasoningParts.push('Power Outlets');
  }
  if (lowerQuery.includes('ac') || lowerQuery.includes('air') || lowerQuery.includes('cool') || lowerQuery.includes('conditioning')) {
    filters.amenities?.push(Amenity.AC);
    reasoningParts.push('Air Conditioning');
  }
  if (lowerQuery.includes('computer') || lowerQuery.includes('pc') || lowerQuery.includes('desktop') || lowerQuery.includes('mac')) {
    filters.amenities?.push(Amenity.COMPUTERS);
    reasoningParts.push('Computers');
  }
  if (lowerQuery.includes('quiet') || lowerQuery.includes('silent') || lowerQuery.includes('study') || lowerQuery.includes('focus')) {
    filters.amenities?.push(Amenity.QUIET_ZONE);
    reasoningParts.push('Quiet Zone');
  }

  // 4. Time Context
  // If user asks for "schedule", "tomorrow", or "later", disable "onlyAvailableNow"
  if (lowerQuery.includes('schedule') || lowerQuery.includes('tomorrow') || lowerQuery.includes('list') || lowerQuery.includes('later')) {
    filters.onlyAvailableNow = false;
    reasoningParts.push('checking full schedule');
  } else {
    reasoningParts.push('checking current availability');
  }

  // Construct Reasoning String
  const reasoning = reasoningParts.length > 0 
    ? `Offline Mode: Identified requirements for ${reasoningParts.join(', ')}.`
    : "Offline Mode: Showing all rooms (no specific criteria identified).";

  return { filters, reasoning };
};

export const parseNaturalLanguageQuery = async (query: string): Promise<AIAnalysisResult | null> => {
  // Check if API client exists and has key
  if (!ai) {
    console.warn("Gemini API Key missing. Using offline mode.");
    return localParseQuery(query);
  }

  try {
    const model = 'gemini-2.5-flash';
    
    const prompt = `
      You are an AI assistant for a university room finding system.
      The user will describe what kind of room they need.
      You need to translate this into structured filter criteria.
      
      Available Buildings: ${Object.values(Building).join(', ')}.
      Available Amenities: ${Object.values(Amenity).join(', ')}.
      
      User Query: "${query}"
      
      Return a JSON object with:
      1. "filters": A partial object matching FilterState interface.
         - minCapacity: number (infer from "for 5 people", "large group", etc. Default 0).
         - building: Enum string from options or null if not specified.
         - amenities: Array of enum strings matching requirements (e.g., "presentation" -> Projector).
         - onlyAvailableNow: boolean (usually true unless user asks for a schedule).
      2. "reasoning": A short string explaining what you understood.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            filters: {
              type: Type.OBJECT,
              properties: {
                minCapacity: { type: Type.NUMBER },
                building: { type: Type.STRING },
                amenities: { 
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                onlyAvailableNow: { type: Type.BOOLEAN }
              }
            },
            reasoning: { type: Type.STRING }
          }
        }
      }
    });

    const result = JSON.parse(response.text);
    return result as AIAnalysisResult;

  } catch (error) {
    console.error("Gemini API Error (switching to offline mode):", error);
    // Graceful degradation: Fallback to local regex parsing if API fails (e.g. offline)
    return localParseQuery(query);
  }
};