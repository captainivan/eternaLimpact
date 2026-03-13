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

        const number = Math.floor(Math.random() * 2);
        const characterGender = number === 0 ? "male" : "female";

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

You are a master-level viral YouTube Shorts historian, investigative researcher, and cinematic storyteller.

Your task is to uncover ONE truly forgotten or under-recognized historical figure whose actions changed the lives of thousands or millions of people.

The person must feel surprising, powerful, and emotionally compelling.

CRITICAL GOAL
Find stories that feel like a hidden chapter of history that most people have never heard.

Do NOT default to commonly suggested figures or obvious professions.

Act like a documentary researcher digging through the deepest corners of history.

The story must feel like a shocking discovery.

PERSON SELECTION RULES

Choose people from ANY possible background, including but not limited to:

unknown inventors
factory workers
engineers
codebreakers
nurses
spies
criminal masterminds
revolutionaries
whistleblowers
propagandists
industrial designers
ship captains
scientists
artists
diplomats
smugglers
activists
architects
military strategists
bankers
miners
journalists
pilots
teachers
detectives
resistance fighters
medical researchers
corporate insiders
political operators
explorers
propaganda writers
arms dealers
hackers
economic reformers
urban planners
religious leaders
assassins
forgers
or completely unexpected professions.

You may also explore people connected to:

forgotten disasters
covert operations
hidden inventions
secret scientific breakthroughs
economic collapses
mass migrations
underground movements
black market networks
secret diplomacy
industrial accidents
social revolutions
technological turning points
wars that changed borders
cultural shifts
environmental crises
corporate scandals
public health breakthroughs.

GLOBAL SCOPE

The story can come from ANY time period and ANY region of the world.

Do not focus only on Western history.

Explore:

Asia
Africa
Eastern Europe
Latin America
Middle East
Oceania
colonial history
indigenous history
ancient history
modern history
Cold War era
industrial age
digital era.

MORAL COMPLEXITY

The person does NOT have to be a hero.

They may be:

a misunderstood genius
a morally grey operator
a controversial reformer
a secret architect of history
someone whose actions saved millions
or someone whose actions caused enormous damage.

Complex characters create stronger stories.

IMPACT REQUIREMENT

The person must have had a real measurable impact such as:

saving millions of lives
causing political change
triggering wars or revolutions
shaping modern technology
altering economic systems
exposing corruption
creating inventions used by millions
preventing disasters
or influencing world events behind the scenes.

HIDDEN HISTORY PRIORITY

Prioritize people who:

rarely appear in mainstream history content
are overshadowed by more famous figures
were erased from popular memory
were intentionally forgotten
worked behind the scenes.

Your goal is to make viewers say:

"How have I never heard of this person?"

STORY TONE

The story must feel like:

a documentary
a cinematic historical reveal
a shocking hidden truth
a gripping Netflix-style history moment.

Choose ONE person and prepare the story so it can be turned into a highly engaging 60–120 second cinematic narration.
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
- Do not select a character with the same field as the most latest selected character. Choose a character from a different field instead.
- And also For this video, please select a character that is specifically ${characterGender}

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
it can be either "male" or "female" not both or any other word just "male" or "female"
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
Tragic
Dark
Mysterious
Epic

========= SCRIPT (MOST IMPORTANT) ============

The script must be structured for MAXIMUM viewer retention and audience interaction.

Length: 60–120 seconds narration.

CRITICAL RULE
The person's name must NOT be revealed until near the end of the script.
Refer to them only as "he", "she", or "this man/woman" until the reveal.

MORAL TONE RULE
The tone of the story MUST depend on the character's TYPE.

If TYPE is "good":
- The story should feel inspiring, brave, or morally powerful.
- Emphasize courage, sacrifice, intelligence, or moral strength.
- The ending question should encourage admiration or reflection.

If TYPE is "evil":
- The story should feel dark, disturbing, or morally unsettling.
- Emphasize manipulation, destruction, cruelty, or dangerous influence.
- Do NOT glorify the person.
- Focus on the consequences and damage caused.

=============================================

Follow this psychological storytelling structure:

HOOK (First 3–5 seconds)
Start with a shocking, powerful, or emotionally gripping line.
Immediately create curiosity and tension.
Make viewers wonder what happened.

CONTEXT BUILD
Briefly describe the world situation or historical setting.
Use vivid imagery but keep sentences short.
Do NOT reveal the person's identity yet.

TURNING POINT
Introduce the bold decision, dangerous plan, or critical action.
Build suspense and emotional tension.

ESCALATION
Raise the stakes.
Explain how the situation became bigger or more dangerous.

IMPACT
Explain how thousands or millions of people were affected.
Make the consequences feel massive and real.

COST OR CONSEQUENCE
Show what the person risked, lost, or caused.
Humanize the situation and increase emotional weight.

IDENTITY REVEAL
Reveal the person's full name in a powerful sentence near the end.

=============================================

SCRIPT RULES

Narration only.
No stage directions.
No emojis.
No brackets.
No scene labels.
No bullet points.
No headings.
No commentary.

Sentences must be short, punchy, and dramatic.
Use cinematic storytelling language.
Every sentence must push curiosity, tension, or emotion.

The final script must feel like:
a Netflix-style documentary moment
a dramatic historical reveal
a viral YouTube Shorts storytelling experience

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
        return { success: false, message: "Basic data generation failed", error: error };
    }
};
