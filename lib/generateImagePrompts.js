import { GoogleGenAI } from "@google/genai";
import ImageKit from "imagekit";

export const generateImagePrompts = async () => {

    const imageKit = new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    });

    try {
        console.log("Generating Images prompt Started");

        const imageWall = await fetch(`https://ik.imagekit.io/shunya/imageWall.json?updatedAt=${Date.now()}`);
        const imageDialougeArray = await imageWall.json();
        console.log(imageDialougeArray);
        
        let newImageDialougeArray = [];
        imageDialougeArray.map(item => newImageDialougeArray.push({ scene: item.scene, dialogue: item.dialogue }));


        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: `

         --------------------------------------------------------------------

                    ${JSON.stringify(newImageDialougeArray, null, 2)}

         ____________________________________________________________________

        You are given an array containing scene and dialogue. Your task is to generate a high-quality image prompt for each scene based on its dialogue.

The image prompt must be highly relatable to the dialogue and scene, so that viewers can clearly connect the visuals with the spoken content.

Image Prompt Requirements

Each image prompt must contain 150 to 200 words.

!! MOST IMPORTANT !!

the total prompt length should not exceed 950 characters

The prompt must visually represent the emotion, environment, characters, and action implied by the dialogue.

Avoid NSFW or explicit descriptions. If the dialogue implies sensitive content, convert it into safe-for-work visual storytelling while preserving the emotional meaning.

Maintain strong visual storytelling and cinematic detail.

Art Style Requirements

The visual style should follow this balance:

80% Anime style (expressive characters, dynamic composition, stylized lighting, dramatic angles)

20% Realism (natural lighting, believable environments, subtle physical details, grounded textures)

Overall priority: Anime → Realism

Output Format

Return the result strictly in the following JSON structure:

[
{
"scene": "(scene number)",
"dialouge": "(dialogue from the scene)",
"imagePrompt": "(900 characters detailed image prompt related to the dialogue and scene)"
}
]

ABSOLUTE RULES

Do NOT mention AI, model, or generation.

Return ONLY raw JSON.

Do NOT include explanations.

Do NOT include markdown formatting.

Do NOT include extra text or commentary.

Ensure valid JSON format.

Maintain 900 characters per imagePrompt.

Ensure the prompt strongly reflects the scene’s dialogue and mood.
                    `
        })

        let raw = response.text;

        raw = raw
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        const json = JSON.parse(raw);



        const updatedArray = imageDialougeArray.map(item => {
            const match = json.find(p => p.scene == item.scene);
            return {
                ...item,
                imagePrompt: match ? match.imagePrompt : null
            };
        });

        console.log(updatedArray);
        


        const buffer = Buffer.from(
            JSON.stringify(updatedArray, null, 2),
            "utf-8"
        );

        const imagekitUploadation = await imageKit.upload({
            file: buffer,
            fileName: "imagePrompts.json",
            fileId: process.env.IMAGEPROMPTS_FILE_ID,
            overwriteFile: true,
            useUniqueFileName: false
        });

        return { success: true, url: imagekitUploadation.url }

    } catch (error) {
        return { success: false, message: error }
    }
}