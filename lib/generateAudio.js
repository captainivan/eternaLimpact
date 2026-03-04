import { GoogleGenAI } from '@google/genai';
import wav from 'wav';

async function saveWaveFile(
    filename,
    pcmData,
    channels = 1,
    rate = 24000,
    sampleWidth = 2,
) {
    return new Promise((resolve, reject) => {
        const writer = new wav.FileWriter(filename, {
            channels,
            sampleRate: rate,
            bitDepth: sampleWidth * 8,
        });

        writer.on('finish', resolve);
        writer.on('error', reject);

        writer.write(pcmData);
        writer.end();
    });
}

export async function generateAudio() {
    console.log("audio gen started")
    const ai = new GoogleGenAI({});

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{
            parts: [{
                text: `
                    He saved more lives than any human who has ever lived, yet you have never heard his name. In the 20th century alone, one monster killed three hundred million people. Smallpox. It was a slow, agonizing death that had haunted humanity for millennia. By 1958, the world had a vaccine, but the disease was still winning because humanity was too busy fighting itself. The Cold War was at its peak. The United States and the Soviet Union were ready to erase each other from the map. Then, a Soviet scientist named Viktor Zhdanov did the unthinkable. He walked into the World Health Assembly and made a demand that felt like a death wish. He told the global powers to stop the war and start a crusade. He didn't just suggest eradication; he forced it. He risked being labeled a traitor to his own empire to collaborate with his enemies. He built a global army of doctors, not soldiers. Because of his iron will, the most successful medical campaign in history began. Ten years later, the monster was dead. Smallpox became the only human disease we have ever completely wiped off the face of the Earth. Five hundred million people are alive today because of this man’s courage. But history rarely rewards the healers. We build statues for the men who started wars, but we let the man who saved the world slip into the shadows. He died without fame, without a monument, and without a thank you. He saved your life before you were even born, and you didn’t even know he existed.
                ` }]
        }],
        config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Fenrir' },
                },
            },
        },
    });

    const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    const audioBuffer = Buffer.from(data, 'base64');

    const fileName = 'out.wav';
    await saveWaveFile(fileName, audioBuffer);
    console.log(`Wrote ${fileName}`);
    return fileName;
}
await generateAudio();