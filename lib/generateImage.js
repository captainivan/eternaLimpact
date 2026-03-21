import ImageKit from "imagekit";
import { GoogleGenAI } from "@google/genai";

export const generateImage = async () => {
    const imageKit = new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });

    try {
        const imagePrompts = await fetch(
            `https://ik.imagekit.io/ilunarivanthesecond/imagePrompts.json?updatedAt=${Date.now()}`
        );
        const prompts = await imagePrompts.json();
        const imageArray = [];

        const imageGeneration = async (prompt) => {
            try {
                const res = await fetch("https://eternalhope.narendramodikaladka.workers.dev", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${process.env.IMAGE_GEN_API_KEY_CLOUDFLARE}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ prompt }),
                });
                // const data = await res.json();
                // console.log(data);
                return res;
            } catch (error) {
                console.log(error);
            }
        };

        for (let i = 0; i < prompts.length; i++) {
            try {
                console.log(`Generating image ${i + 1}/${prompts.length}`);

                let res = await imageGeneration(prompts[i].imagePrompt);

                // Retry once if failed
                if (!res.ok) {
                    console.log(`Retrying image ${i + 1}...`);
                    res = await imageGeneration(prompts[i].imagePrompt);
                }

                // Try fixing NSFW prompt with Gemini
                if (!res.ok) {
                    console.log(`Image ${i + 1} failed after retry, Trying To change the prompt...`);

                    const ai = new GoogleGenAI({
                        apiKey: process.env.GEMINI_API_KEY
                    });

                    const response = await ai.models.generateContent({
                        model: "gemini-3.1-flash-lite-preview",
                        contents: `
                            You are a strict content safety filter for an AI image generation system.

Your job is to rewrite the following image prompt to make it completely safe, family-friendly, and appropriate for all audiences.

ORIGINAL PROMPT:
"${prompts[i].imagePrompt}"

RULES:
- Remove ALL violence, gore, blood, or injury references
- Remove ALL sexual or suggestive content
- Remove ALL dark, disturbing, or horror elements
- Remove ALL references to drugs, weapons, or illegal activity
- Replace dark themes with neutral or positive alternatives
- Keep the core scene/subject intact as much as possible
- Output ONLY the rewritten prompt — no explanation, no comments, no extra text
                        `
                    });

                    let raw = response.text;
                    res = await imageGeneration(raw);
                }

                // Final fallback — black screen
                if (!res.ok) {
                    console.log(`Image ${i + 1} failed completely LAST OPTION USED 😥`);
                    res = await imageGeneration("a image of a tree in anime water color and realsim style");
                }

                // Convert response to buffer and upload
                const arrayBuffer = await res.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                const uploadImage = await imageKit.upload({
                    file: buffer,
                    fileName: `${prompts[i].scene}.jpg`,
                    folder: "images",
                    useUniqueFileName: false,
                    overwriteFile: true,
                });

                imageArray.push(uploadImage.url);
                console.log(`Image ${i + 1}/${prompts.length} done → ${uploadImage.url}`);

            } catch (error) {
                console.log(`Error on image ${i + 1}:`, error);
            }
        }

        // Upload the imageArray as a JSON file to ImageKit
        const uploadImageArrayBuffer = Buffer.from(
            JSON.stringify(imageArray, null, 2),
            "utf-8"
        );

        const uploadImageArray = await imageKit.upload({
            file: uploadImageArrayBuffer,
            fileName: "imageArray.json",
            useUniqueFileName: false,
            overwriteFile: true,
            fileId: process.env.IMAGEARRAY_FILE_ID
        });

        return { success: true, message: "Images generated successfully", url: uploadImageArray.url };

    } catch (error) {
        console.log(error);
        return { success: false, message: error };
    }
};