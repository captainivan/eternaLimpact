import { TypecastClient } from "@neosapience/typecast-js";
import fs from 'fs';

export const generateAudio = async () => {
    try {
        console.log("Audio Generation Started...")
        const client = new TypecastClient({
            apiKey:process.env.AUDIO_GENERATION_API_KEY
        });

        const audio = await client.textToSpeech({
            text: "He saved more lives than any human who has ever lived, yet you have never heard his name. In the 20th century alone, one monster killed three hundred million people. Smallpox. It was a slow, agonizing death that had haunted humanity for millennia. By 1958, the world had a vaccine, but the disease was still winning because humanity was too busy fighting itself. The Cold War was at its peak. The United States and the Soviet Union were ready to erase each other from the map. Then, a Soviet scientist named Viktor Zhdanov did the unthinkable. He walked into the World Health Assembly and made a demand that felt like a death wish. He told the global powers to stop the war and start a crusade. He didn't just suggest eradication; he forced it. He risked being labeled a traitor to his own empire to collaborate with his enemies. He built a global army of doctors, not soldiers. Because of his iron will, the most successful medical campaign in history began. Ten years later, the monster was dead. Smallpox became the only human disease we have ever completely wiped off the face of the Earth. Five hundred million people are alive today because of this man’s courage. But history rarely rewards the healers. We build statues for the men who started wars, but we let the man who saved the world slip into the shadows. He died without fame, without a monument, and without a thank you. He saved your life before you were even born, and you didn’t even know he existed.",
            model: "ssfm-v30",
            voice_id: "tc_6620ee223bc61e2f6b79fdb5",
            prompt: {
                emotion_type: "smart"
            }
        });

        await fs.promises.writeFile('typecast.wav', Buffer.from(audio.audioData));
        return audio;
    } catch (error) {
        console.log(error)
    }
}