import { GoogleGenAI, Type } from "@google/genai";

// --- Client Management ---
const getAiClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY_MISSING: The app environment does not have a valid API Key.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// --- Parsers ---
const scheduleSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "Name of the medicine or activity" },
      time: { type: Type.STRING, description: "Time in HH:mm 24-hour format" },
      frequency: { type: Type.STRING, description: "Frequency (e.g., Daily)" },
      instructions: { type: Type.STRING, description: "Instructions" },
      type: { type: Type.STRING, enum: ["medicine", "lifestyle"] },
    },
    required: ["name", "time", "type"],
  },
};

export const parseSchedule = async (input: string) => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Parse into JSON. Current Time: ${new Date().toLocaleString()}. Input: "${input}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: scheduleSchema,
      },
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Schedule Parse Error:", error);
    throw error;
  }
};

// --- Persona & Image Generation ---

export const generateAvatar = async (
  name: string,
  age: string,
  relationship: string,
  personality: string
) => {
  try {
    const ai = getAiClient();
    const prompt = `A professional, realistic square headshot profile picture of ${name}, who is a ${age} year old ${relationship}. Personality traits: ${personality}. High quality, soft lighting, neutral background.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: { aspectRatio: "1:1", imageSize: "1K" }
      }
    });
    
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return `https://ui-avatars.com/api/?name=${name}&background=random`; // Fallback
  } catch (e) {
    console.error("Avatar Gen Error", e);
    return `https://ui-avatars.com/api/?name=${name}&background=random`;
  }
};

export const generatePersonaMessage = async (
  reminderName: string,
  memberName: string,
  relationship: string,
  personality: string
) => {
  try {
    const ai = getAiClient();
    const isDoctor = relationship.toLowerCase().includes('doctor');
    
    let prompt = "";
    if (isDoctor) {
        prompt = `You are Dr. ${memberName}. Write a short, professional but caring message reminding the patient to take "${reminderName}". Include a brief (5-8 words) mention of the medical advantage of adherence or a recent health fact related to it.`;
    } else {
        prompt = `You are acting as ${memberName}, who is the ${relationship} of the user.
        Personality traits: ${personality}.
        Task: Write a very short (1 sentence), WhatsApp-style message reminding the user to take/do "${reminderName}".
        Language: Mix English with some Hindi words (Hinglish) if appropriate for an Indian family context.
        Do not give medical advice. Be emotional and personal based on the traits.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text?.trim();
  } catch (error) {
    return `Please take your ${reminderName}`;
  }
};

export const generatePersonaChatReply = async (
    userMessage: string,
    history: any[],
    memberName: string,
    relationship: string,
    personality: string
) => {
    try {
        const ai = getAiClient();
        const systemInstruction = `You are ${memberName}, the ${relationship} of the user (Ram Prasad/Nanu).
        Your personality is: ${personality}.
        Context: This is a private chat between you and the user in a medicine reminder app.
        Goal: Reply to the user's message naturally. Keep it relatively short (WhatsApp style).
        Cultural Context: Indian family setting. Use Hinglish if appropriate for the persona.
        Constraint: Never say you are an AI. Stay in character completely.
        `;

        const chat = ai.chats.create({
            model: "gemini-2.5-flash",
            config: {
                systemInstruction: systemInstruction,
            },
            history: history
        });

        const result = await chat.sendMessage({ message: userMessage });
        return result.text;
    } catch (error) {
        console.error("Chat Error", error);
        return "Ok, I understand.";
    }
};

export const generatePersonaVideo = async (prompt: string, imageBase64OrUrl: string) => {
    // Note: In a real implementation with Veo, we would use the image input.
    // However, Veo preview strictly requires specific access or might be slow for this demo.
    // We will simulate a wait and return a placebo or use text-to-video if available,
    // but for this specific "Build" environment, we might just return the logic.
    
    // Returning a mock delay to simulate generation for the UI experience
    await new Promise(r => setTimeout(r, 2000));
    return ""; // In a real app, this would be the video URL.
}

export const chatHealthAssistant = async (input: string) => {
    // Placeholder for general health assistant if needed
    return "I am your health assistant.";
}