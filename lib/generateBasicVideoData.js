import { GoogleGenAI } from "@google/genai";
import ImageKit from "imagekit";

export const generateVideoBasicData = async () => {

    const imageKit = new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    });

    try {
        console.log("basic data process started 🚶");

//         const ai = new GoogleGenAI({
//             apiKey: process.env.GEMINI_API_KEY
//         });

//         const response = await ai.models.generateContent({
//             model: "gemini-3-flash-preview",
//             generationConfig: {
//                 temperature: 1.25,
//                 topP: 0.9,
//                 topK: 80
//             },
//             contents: `
//         You are a master-level viral YouTube Shorts historian and cinematic storyteller.

// Your task is to identify ONE truly forgotten legendary person whose actions significantly impacted millions of lives, but who is rarely remembered or talked about today.

// The person can be from ANY field or occupation (science, medicine, war, crime, engineering, labor, politics, art, espionage, industry, industry, social movements, etc.).
// They can be good, evil, or morally complex.

// Avoid famous or commonly known names.
// The person must be genuinely under-remembered.

// The story must feel dramatic, emotional, intense, and cinematic.
// It must feel like a Netflix-level documentary condensed into 60–120 seconds.

// ================ OUTPUT FORMAT =================
// RETURN ONLY VALID JSON:

// {
//   "title": "",
//   "desc": "",
//   "tags": [],
//   "name": "",
//   "field": "",
//   "script": ""
// }

// ================================================

// ================ ABSOLUTE RULES ================
// 1. NO AI DISCLOSURE — never mention AI, model, system, generation.
// 2. Return ONLY raw JSON.
// 3. Do NOT include explanations.
// 4. Do NOT include markdown.
// 5. Do NOT include extra text.
// 6. Do NOT include commentary.
// =================================================

// ============== TITLE ===============

// - Short.
// - Emotionally powerful.
// - Curiosity-driven.
// - Highly SEO friendly.
// - Must create immediate intrigue and tension.
// - Maximum 12 words.

// ============= DESC ===============

// - 5–7 lines.
// - Line 1–2: Who the person was (emotionally framed).
// - Line 3–4: What they did and why it mattered.
// - Final 2 lines: 2–4 viral SEO hashtags only.
// - Must feel dramatic and mysterious.
// - Optimized for YouTube Shorts discovery.

// ============= TAGS =============

// - 8–15 viral searchable tags.
// - Every tag MUST start with "#".
// - Each tag must be 5–20 characters.
// - Highly SEO optimized.
// - No duplicate meaning tags.

// =========== NAME ============

// Full name of the chosen person.

// ========== FIELD ============

// ONE word only.
// Example: "Medicine", "Espionage", "Engineering", "Warfare", "Industry", etc.

// ========= SCRIPT (MOST IMPORTANT) ============

// The script must be structured for MAXIMUM viewer retention.

// Length: 60–120 seconds narration.

// Follow this exact psychological storytelling structure:

// 1. HOOK (First 3–5 seconds)
//    - Start with a shocking, impossible, or emotionally powerful line.
//    - No greetings.
//    - No slow intro.
//    - Immediately create tension.

// 2. CONTEXT BUILD (Emotional Setup)
//    - Briefly explain the world situation.
//    - Make the stakes clear.
//    - Use vivid imagery.

// 3. TURNING POINT
//    - Introduce the bold decision or action.
//    - Build suspense.
//    - Make it feel risky or dangerous.

// 4. IMPACT
//    - Clearly explain how millions were affected.
//    - Show consequences.
//    - Make it feel huge.

// 5. COST OR SACRIFICE
//    - Show what they lost.
//    - Emotional weight.
//    - Humanize them.

// 6. LEGACY + IRONY
//    - Explain how history forgot them.
//    - End with a powerful reflective or haunting final line.
//    - The last sentence must hit hard.

// SCRIPT RULES:
// - Narration only.
// - No stage directions.
// - No emojis.
// - No brackets.
// - No scene labels.
// - No bullet points.
// - No headings.
// - No commentary.
// - Sentences must be short, punchy, dramatic.
// - Use cinematic language.
// - Avoid filler words.
// - Every sentence must push emotion or tension.
// - Make it feel binge-worthy.

// The final script must feel like:
// - Dark documentary
// - Dramatic historical reel
// - Emotional storytelling short
// - High retention YouTube Shorts format
//       `
//         });

//         let raw = response.text;

//         raw = raw
//             .replace(/```json/gi, "")
//             .replace(/```/g, "")
//             .trim();

//         const json = JSON.parse(raw);

//         console.log("Uploading to ImageKit...");

//         const buffer = Buffer.from(
//             JSON.stringify(json, null, 2),
//             "utf-8"
//         );

//         await imageKit.upload({
//             file: buffer,
//             fileName: "basicData.json",
//             fileId: process.env.BASICDATA_FILE_ID,
//             overwriteFile: true,
//             useUniqueFileName: false
//         });

        const json = {"message":"goin on ++++++++++++"}

        console.log("📤 basicData.json uploaded");

        return json;

    } catch (error) {
        console.log("Error --------------------- ", error);
    }
};