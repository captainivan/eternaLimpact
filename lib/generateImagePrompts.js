import { GoogleGenAI } from "@google/genai";
import ImageKit from "imagekit";

export const generateImagePrompts = async () => {

    const BASE_URL = process.env.IMAGEKIT_URL_ENDPOINT;

    const imageKit = new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    });

    try {
        console.log("Generating Image Prompts Started");

        // Fetch the image wall JSON
        const imageWall = await fetch(`${BASE_URL}/imageWall.json?updatedAt=${Date.now()}`);
        const imageDialogueArray = await imageWall.json();

        // Fix: Use map() properly to build a new array instead of forEach with push
        const newImageDialogueArray = imageDialogueArray.map(({ scene, dialogue }) => ({
            scene,
            dialogue
        }));

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `
--------------------------------------------------------------------

${JSON.stringify(newImageDialogueArray, null, 2)}

____________________________________________________________________

You are given an array containing scene and dialogue. Your task is to generate a high-quality image prompt for each scene based on its dialogue.

The image prompt must be highly relatable to the dialogue and scene, so that viewers can clearly connect the visuals with the spoken content.

Image Prompt Requirements:
- Each image prompt must be between 150 to 200 words.
- The prompt must visually represent the emotion, environment, characters, and action implied by the dialogue.
- Avoid NSFW or explicit descriptions. If the dialogue implies sensitive content, convert it into safe-for-work visual storytelling while preserving the emotional meaning.
- Maintain strong visual storytelling and cinematic detail.

Art Style Requirements:
The visual style should follow this balance:
- 80% Anime style (expressive characters, dynamic composition, stylized lighting, dramatic angles)
- 20% Realism (natural lighting, believable environments, subtle physical details, grounded textures)
Overall priority: Anime → Realism

Output Format:
Return the result strictly in the following JSON structure:

[
  {
    "scene": "(scene number)",
    "dialogue": "(dialogue from the scene)",
    "imagePrompt": "(detailed image prompt related to the dialogue and scene)"
  }
]

ABSOLUTE RULES:
- Do NOT mention AI, model, or generation.
- Return ONLY raw JSON.
- Do NOT include explanations.
- Do NOT include markdown formatting.
- Do NOT include extra text or commentary.
- Ensure valid JSON format.
- Ensure the prompt strongly reflects the scene's dialogue and mood.
            `
        });

        let raw = response.text;

        console.log("Raw Gemini response:", raw);

        // Strip markdown code fences if present
        raw = raw
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        const json = JSON.parse(raw);

        // Fix: Validate that the response is an array before using it
        if (!Array.isArray(json)) {
            throw new Error("Unexpected response format from Gemini: expected an array");
        }

        // Merge imagePrompts back into the original array
        const updatedArray = imageDialogueArray.map(item => {
            const match = json.find(p => p.scene == item.scene);
            return {
                ...item,
                imagePrompt: match ? match.imagePrompt : null
            };
        });


        const buffer = Buffer.from(
            JSON.stringify(updatedArray, null, 2),
            "utf-8"
        );

        // Fix: Removed fileId — useUniqueFileName: false + same fileName handles overwrite correctly
        const imagekitUpload = await imageKit.upload({
            file: buffer,
            fileName: "imagePrompts.json",
            overwriteFile: true,
            useUniqueFileName: false
        });

        return { success: true, url: imagekitUpload.url };

    } catch (error) {
        // Fix: Serialize error properly
        console.error("Error in generateImagePrompts:", error);
        return { success: false, message: error.message ?? String(error) };
    }
};