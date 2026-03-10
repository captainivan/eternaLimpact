
export async function generateAudio() {
    try {
        console.log("Audio Generation Started ...");
        const api = await fetch("https://eterna-limpact-audio.vercel.app/api/audio", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const res = await api.json();
        return res;
    } catch (error) {
        console.error("Audio Generation Failed ❌", error.message);
        return { success: false, message: error.message };
    }
}