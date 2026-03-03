import { GoogleGenAI } from "@google/genai"



export const generateVideoBasicData = async () => {
    try {
        console.log(`basic data process is been started 🚶`)
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            generationConfig: {
                temperature: 1.25,
                topP: 0.9,
                topK: 80
            },
            contents: `
            return an array of list of 10 pokemns like this
                [
                    {
                        name:"",
                        type:""
                    }
                ]

                no explanation nothing just json nothing else
            `
        });
        let raw = response.text;
        raw = raw.replace(/```json/gi, "").replace().replace(/```/g, "").trim();
        const json = JSON.parse(raw);
        return (json)
    } catch (error) {
        console.log(error)
    }
}