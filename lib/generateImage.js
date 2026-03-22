import ImageKit from "imagekit";
import { GoogleGenAI } from "@google/genai";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const PICSART_API_KEYS = [
  process.env.PICSART_API_KEY_1,
  process.env.PICSART_API_KEY_2,
  process.env.PICSART_API_KEY_3,
  process.env.PICSART_API_KEY_4,
  process.env.PICSART_API_KEY_5,
  process.env.PICSART_API_KEY_6,
  process.env.PICSART_API_KEY_7,
  process.env.PICSART_API_KEY_8,
].filter(Boolean); // Remove any undefined keys

// --- Rewrite an unsafe prompt using Gemini ---
const rewritePrompt = async (originalPrompt) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `
      You are a strict content safety filter for an AI image generation system.
      Your job is to rewrite the following image prompt to make it completely safe,
      family-friendly, and appropriate for all audiences.

      ORIGINAL PROMPT:
      "${originalPrompt}"

      RULES:
        - Remove ALL violence, gore, blood, or injury references
        - Remove ALL sexual or suggestive content
        - Remove ALL dark, disturbing, or horror elements
        - Remove ALL references to drugs, weapons, or illegal activity
        - Replace dark themes with neutral or positive alternatives
        - Keep the core scene/subject intact as much as possible
        - Output ONLY the rewritten prompt — no explanation, no comments, no extra text
        - image prompt must contain 150 to 200 words.
    `,
  });
  return response.text.trim();
};

// --- Poll Picsart until the image is ready or failed ---
const pollForImage = async (inferenceId, apiKey, maxAttempts = 20) => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await sleep(3000); // Wait 3 seconds between polls

    const res = await fetch(
      `https://genai-api.picsart.io/v1/text2image/inferences/${inferenceId}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "X-Picsart-API-Key": apiKey,
        },
      }
    );
    const data = await res.json();

    if (data.status === "success") {
      // Return the first image URL from the result
      return { success: true, url: data.data?.[0]?.url ?? null };
    }

    if (data.status === "error") {
      return { success: false, reason: "picsart_error" };
    }

    // status === "pending" or "processing" — keep polling
    console.log(`  Polling attempt ${attempt + 1}: status = ${data.status}`);
  }

  return { success: false, reason: "timeout" };
};

// --- Submit a prompt to Picsart and return the inference_id ---
const submitToPicsart = async (prompt, apiKey) => {
  const res = await fetch(`https://genai-api.picsart.io/v1/text2image`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "X-Picsart-API-Key": apiKey,
    },
    body: JSON.stringify({
      width: 576,
      height: 1024,
      count: 1,
      model: "urn:air:fluxai:model:fluxai:flux-2-pro@1",
      prompt,
    }),
  });
  return await res.json();
};

// --- Fetch image URL → buffer → upload to ImageKit ---
const uploadToImageKit = async (imageUrl, scene) => {
  const res = await fetch(imageUrl);
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    imageKit.upload(
      {
        file: buffer,
        fileName: `${scene}.jpg`,
        folder: "images",
        useUniqueFileName: false,
        overwriteFile: true,
      },
      (err, result) => (err ? reject(err) : resolve(result))
    );
  });
};

// --- Generate one image for a given prompt using one API key ---
const generateOneImage = async (promptObj, apiKey) => {
  let prompt = promptObj.imagePrompt;

  for (let attempt = 1; attempt <= 2; attempt++) {
    console.log(`  Attempt ${attempt} with prompt: "${prompt.slice(0, 60)}..."`);

    const submission = await submitToPicsart(prompt, apiKey);

    if (!submission.inference_id) {
      console.warn("  No inference_id returned:", submission);
      return null;
    }

    const result = await pollForImage(submission.inference_id, apiKey);

    if (result.success && result.url) {
      const uploaded = await uploadToImageKit(result.url, promptObj.scene ?? promptObj.id ?? Date.now());
      console.log(`  ✅ Uploaded to ImageKit: ${uploaded.url}`);
      return { ...uploaded, usedApiKey: apiKey };
    }

    if (result.reason === "picsart_error" && attempt === 1) {
      // Rewrite the prompt and retry once
      console.warn("  Picsart error — rewriting prompt with Gemini...");
      prompt = await rewritePrompt(prompt);
      console.log(`  Rewritten prompt: "${prompt.slice(0, 60)}..."`);
    } else {
      console.warn(`  ❌ Failed after attempt ${attempt}: ${result.reason}`);
      return null;
    }
  }
};

// --- Main export ---
export const generateImage = async () => {
  try {
    // Fetch prompts list
    const imagePrompts = await fetch(
      `https://ik.imagekit.io/ilunarivanthesecond/imagePrompts.json?updatedAt=${Date.now()}`
    );
    const prompts = await imagePrompts.json();

    console.log(
      `Loaded ${prompts.length} prompts and ${PICSART_API_KEYS.length} API keys.`
    );

    const imageArray = [];
    let lastSuccessfulKeyIndex = null;

    // Distribute prompts across API keys (round-robin)
    for (let j = 0; j < prompts.length; j++) {
      const keyIndex = j % PICSART_API_KEYS.length;
      const apiKey = PICSART_API_KEYS[keyIndex];
      console.log(`\nProcessing prompt ${j + 1}/${prompts.length} (API key #${keyIndex + 1})...`);

      try {
        const uploaded = await generateOneImage(prompts[j], apiKey);
        if (uploaded?.url) {
          imageArray.push(uploaded.url);
          lastSuccessfulKeyIndex = keyIndex;
        }
      } catch (err) {
        console.error(`  Error on prompt ${j + 1}:`, err);
      }
    }

    // Upload imageArray as JSON to ImageKit
    const uploadImageArrayBuffer = Buffer.from(JSON.stringify(imageArray, null, 2), "utf-8");
    const uploadImageArray = await imageKit.upload({
      file: uploadImageArrayBuffer,
      fileName: "imageArray.json",
      useUniqueFileName: false,
      overwriteFile: true,
      fileId: process.env.IMAGEARRAY_FILE_ID,
    });

    console.log("\n✅ All prompts processed.");
    const lastSuccessfulKey = lastSuccessfulKeyIndex !== null
      ? `PICSART_API_KEY_${lastSuccessfulKeyIndex + 1}`
      : null;

    return {
      success: true,
      message: "Images generated successfully",
      url: uploadImageArray.url,
      lastSuccessfulKey,
    };
  } catch (error) {
    console.error("Fatal error in generateImage:", error);
    return { success: false, message: error };
  }
};