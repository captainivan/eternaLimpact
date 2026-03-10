import { GoogleGenAI } from "@google/genai";
import ImageKit from "imagekit";

export const generateVideoBasicData = async (aimodel = "gemini-3-flash-preview") => {

    const imageKit = new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    });

    try {

        console.log("basic data process started 🚶");

        const allCharacterArray = await fetch(
            `https://ik.imagekit.io/ilunarivanthesecond/totalCharacters.json?updatedAt=${Date.now()}`
        );

        const characterArray = await allCharacterArray.json();

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });

        const response = await ai.models.generateContent({
            model: aimodel,
            generationConfig: {
                temperature: 1.25,
                topP: 0.9,
                topK: 80
            },
            contents: `
                You are a master-level viral YouTube Shorts historian and cinematic storyteller.

Your task is to identify ONE truly forgotten legendary person whose actions significantly impacted millions of lives, but who is rarely remembered or talked about today.

The person can be from ANY field or occupation (science, medicine, war, crime, engineering, labor, politics, art, espionage, industry, industry, social movements, etc.).
They can be good, evil, or morally complex.

Avoid famous or commonly known names.
The person must be genuinely under-remembered.

The story must feel dramatic, emotional, intense, and cinematic.
It must feel like a Netflix-level documentary condensed into 60–120 seconds.

================ OUTPUT FORMAT =================
RETURN ONLY VALID JSON:

{
  "title": "",
  "desc": "",
  "tags": [],
  "name": "",
  "field": "",
  "script": "",
  "type":"",
  "gender":"",
  "musicstyle":""
}

================================================

IMPORTANT CONTEXT — Read Before Proceeding:

The following characters have already been generated in a previous video.
DO NOT create new scripts or aany other data for any of these characters:

${JSON.stringify(characterArray, null, 2)}

Treat this list as strictly off-limits for new content generation.

==============================================

CHARACTER SELECTION RULE — Apply This Logic Before Choosing:

The most recently generated character is shown below:

${JSON.stringify(characterArray[characterArray.length - 1], null, 2)}

Follow this rule strictly when selecting the next character:
- If the latest character's "type" is "evil"  → Choose a character whose "type" is "good"
- If the latest character's "type" is "good"  → Choose a character whose "type" is "evil"
- If the "gender" of the latest character is "male"  → Choose a character whose "gender" is "female"
- If the "gender" of the latest character is "female"  → Choose a character whose "gender" is "male"


This ensures alternating character types across videos.



================ ABSOLUTE RULES ================
1. NO AI DISCLOSURE — never mention AI, model, system, generation.
2. Return ONLY raw JSON.
3. Do NOT include explanations.
4. Do NOT include markdown.
5. Do NOT include extra text.
6. Do NOT include commentary.
=================================================

============== TITLE ===============

- Short.
- Emotionally powerful.
- Curiosity-driven.
- Highly SEO friendly.
- Must create immediate intrigue and tension.
- Maximum 12 words.

============= DESC ===============

- 5–7 lines.
- Line 1–2: Who the person was including the name of person (emotionally framed).
- Line 3–4: What they did and why it mattered.
- Final 2 lines: 2–4 viral SEO hashtags only.
- Must feel dramatic and mysterious.
- Optimized for YouTube Shorts discovery.

============= TAGS =============

- 8–15 viral searchable tags.
- Every tag MUST start with "#".
- Each tag must be 5–20 characters.
- Highly SEO optimized.
- No duplicate meaning tags.

=========== NAME ============

Full name of the chosen person.

========== FIELD ============

ONE word only.
Example: "Medicine", "Espionage", "Engineering", "Warfare", "Industry", etc.

========== TYPE ============

ONE word only.
it can be either good or evil not both or any other word just good or evil 
acoording to the work done by the person

========== GENDER ===========

One word only.
it can be either male or female not both or any other word just male or female
acording to the gender of our character

========== MUSIC STYLE ==========

Select ONLY ONE music style from the list below.

Rules:
- Choose exactly one option.
- Use the exact wording provided.
- Do NOT modify, shorten, or add words.
- Output only the selected music style.

Available options:

Inspirational
Heroic
Tragic
Dark
Mysterious
Epic
Triumphant

========= SCRIPT (MOST IMPORTANT) ============

The script must be structured for MAXIMUM viewer retention.

Length: 60–120 seconds narration.

CRITICAL RULE
The person’s name should be revealed at the end of the script.
Refer to them only as "he", "she", or "this man/woman" until the reveal.

Follow this psychological storytelling structure:

HOOK (First 3–5 seconds)
Start with a shocking, impossible, or emotionally powerful line.
No greetings.
No slow intro.
Immediately create tension.

CONTEXT BUILD (Emotional Setup)
Briefly explain the world situation.
Make the stakes clear.
Use vivid imagery.
Still do NOT reveal the person's name.

TURNING POINT
Introduce the bold decision or action.
Build suspense.
Make it feel risky or dangerous.
Continue referring to the person indirectly.

IMPACT
Explain how millions were affected.
Show large-scale consequences.
Make the impact feel massive.

COST OR SACRIFICE
Show what they lost.
Add emotional weight.
Humanize the character.

LEGACY BUILDUP
Explain how history moved on.
Hint that this person changed everything.
Still keep their identity hidden.

FINAL REVEAL (LAST SENTENCE ONLY)
The final sentence must reveal the person’s name.
It must feel like a powerful twist or realization.
The name should land as the emotional punch of the entire story.

SCRIPT RULES
Narration only.
No stage directions.
No emojis.
No brackets.
No scene labels.
No bullet points.
No headings.
No commentary.
Sentences must be short, punchy, dramatic.
Use cinematic language.
Avoid filler words.
Every sentence must push emotion or tension.
Make it feel binge-worthy.

The final script must feel like
documentary style
Dramatic historical reel
Emotional storytelling short
High retention YouTube Shorts format

            `
        });

        if (!response || !response.text) {
            if (aimodel !== "gemini-2.5-pro") {
                return await generateVideoBasicData("gemini-2.5-pro");
            }

            if (aimodel !== "gemini-2.5-flash") {
                return await generateVideoBasicData("gemini-2.5-flash");
            }

            throw new Error("All models failed");
        }

        let raw = response.text;

        raw = raw
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        const json = JSON.parse(raw);

        console.log("Uploading to ImageKit...");

        const buffer = Buffer.from(JSON.stringify(json, null, 2), "utf-8");

        const basicDataUploadImagekit = await imageKit.upload({
            file: buffer,
            fileName: "basicData.json",
            fileId: process.env.BASICDATA_FILE_ID,
            overwriteFile: true,
            useUniqueFileName: false
        });

        const newArray = [
            ...characterArray,
            {
                name: json.name,
                field: json.field,
                type: json.type,
                gender: json.gender
            }
        ];

        const newBuffer = Buffer.from(
            JSON.stringify(newArray, null, 2),
            "utf-8"
        );

        await imageKit.upload({
            file: newBuffer,
            fileName: "totalCharacters.json",
            fileId: process.env.TOTALCHARACTERS_FILE_ID,
            overwriteFile: true,
            useUniqueFileName: false
        });

        console.log("📤 basicData.json uploaded");

        return { success: true, url: basicDataUploadImagekit.url };

    } catch (error) {
        console.log("Error --------------------- ", error);
        return { success: false, message: "Basic data generation failed",error:error };
    }
};
