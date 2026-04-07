import ImageKit from "imagekit";


export const generateImageWall = async () => {

    const BASE_URL=process.env.IMAGEKIT_URL_ENDPOINT;

    const imageKit = new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    });

    try {
        const file = await fetch(`${BASE_URL}/subtitles.json?updatedAt=${Date.now()}`);
        const res = await file.json();
        const subtitles = res.words;

        const scenes = [];
        if (!subtitles.length) return scenes;

        let sceneNumber = 1;
        let fromWordIndex = 0;
        let currentWords = [];

        // 4 second bucket
        const getBucket = (ms) => Math.floor(ms / 4000);

        let currentBucket = getBucket(subtitles[0].start);

        subtitles.forEach((wordObj, index) => {
            const bucket = getBucket(wordObj.start);

            if (bucket !== currentBucket) {
                scenes.push({
                    scene: sceneNumber,
                    dialogue: currentWords.map(w => w.text).join(" "),
                    fromWord: fromWordIndex,
                    toWord: index - 1
                });

                sceneNumber++;
                currentBucket = bucket;
                fromWordIndex = index;
                currentWords = [];
            }

            currentWords.push(wordObj);
        });

        // Push last scene
        if (currentWords.length) {
            scenes.push({
                scene: sceneNumber,
                dialogue: currentWords.map(w => w.text).join(" "),
                fromWord: fromWordIndex,
                toWord: subtitles.length - 1
            });
        }

        const buffer = Buffer.from(JSON.stringify(scenes,null,2),"utf-8");


        const fileWall = await imageKit.upload({
            file: buffer,
            fileName: "imageWall.json",
            fileId: process.env.IMAGEWALL_FILE_ID,
            overwriteFile: true,
            useUniqueFileName: false
        })

        console.log("Image Wall Uploaded SuceesFully on Imagekit 😎");
        
        return { success: true, url: fileWall.url };

    } catch (error) {
        return { success: false, message: error }
    }
}