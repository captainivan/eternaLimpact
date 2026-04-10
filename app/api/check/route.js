

export async function POST() {
    let arr = [];
    const KEYS = [
        process.env.PICSART_API_KEY_1,
        process.env.PICSART_API_KEY_2,
        process.env.PICSART_API_KEY_3,
        process.env.PICSART_API_KEY_4,
        process.env.PICSART_API_KEY_5,
        process.env.PICSART_API_KEY_6,
        process.env.PICSART_API_KEY_7,
        process.env.PICSART_API_KEY_8,
        process.env.PICSART_API_KEY_9,
        process.env.PICSART_API_KEY_10,
        process.env.PICSART_API_KEY_11
    ]
    let credits = 0;
    for (let i = 0; i < KEYS.length; i++) {
        try {
            const api = await fetch("https://genai-api.picsart.io/v1/balance", {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    'X-Picsart-API-Key': `${KEYS[i]}`
                }
            });
            const data = await api.json();
            console.log(data);
            arr.push(data);
            credits += data.credits;
        } catch (error) {
            console.log(error);
        }
    }
    console.log(arr);
    return Response.json({arr,credits})
}