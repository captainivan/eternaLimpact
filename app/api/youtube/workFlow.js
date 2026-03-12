import { generateAudio } from "@/lib/generateAudio";
import { generateVideoBasicData } from "@/lib/generateBasicVideoData";
import { generateImage } from "@/lib/generateImage";
import { generateImagePrompts } from "@/lib/generateImagePrompts";
import { generateImageWall } from "@/lib/generateImageWall";
import { generateSubtitles } from "@/lib/generateSubtitles";
import { githubTriger } from "@/lib/githubTriger";
import { sendMessage } from "@/lib/sendNotification";

let workFlowRunning = false;

export const runWorkFlow = async (initialStage) => {

    if (workFlowRunning) {
        console.log("Workflow is already Runing wait second request denied 😤")
        return;
    }

    workFlowRunning = true;

    try {

        console.log(`------- WorkFlow Started --------`);

        let stage = initialStage;

        while (stage) {

            // STAGE 1

            if (stage === "basicVideoDataGeneration") {
                console.log(`Stage : ${stage}`)
                const basicData = await generateVideoBasicData();
                if (basicData.success == true) {
                    console.log("basicData Genereated SuceesFully 🎉", basicData.url)
                    const message = await sendMessage("basicData Genereated SuceesFully");
                    stage = "audiogeneration"
                    continue;
                } else {
                    const message = await sendMessage("Basic Data Generation Failed Not Posting Video today");
                    return { message: "Basic Data Generation Failed Not Posting Video today" }
                }
            }

            // STAGE 2

            if (stage === "audiogeneration") {
                console.log("------------ Audio Generation Started --------------");
                console.log(`Stage : ${stage}`);
                const audioGeneration = await generateAudio();
                if (audioGeneration.success == true) {
                    const message = await sendMessage(`Audio Genereated SuceesFully using key ${audioGeneration.key}/${audioGeneration.totalKeys}`);
                    console.log("Audio Genereated SuceesFully 🎉", audioGeneration.url)
                    stage = "subtitlesGeneration"
                    continue;
                } else {
                    const message = await sendMessage("Audio Generation Failed Not Posting Video today");
                    return { message: "Audio Generation Failed Not Posting Video today" }
                }
            }

            // STAGE 3

            if (stage === "subtitlesGeneration") {
                console.log("------------ Subtitles Generation Started --------------");
                console.log(`Stage : ${stage}`);
                const subtitlesGeneration = await generateSubtitles();
                if (subtitlesGeneration.success == true) {
                    const message = await sendMessage("Subtitles Genereated SuceesFully");
                    console.log("Subtitles Genereated SuceesFully 🎉", subtitlesGeneration.url)
                    stage = "imageWallGeneration"
                    continue;
                } else {
                    const message = await sendMessage("Audio Generation Failed Not Posting Video today");
                    return { message: "Audio Generation Failed Not Posting Video today" }
                }
            }

            // STAGE 4 

            if (stage === "imageWallGeneration") {
                console.log("------------- Image Wall Generation Started --------------");
                console.log(`Stage : ${stage}`);
                const imageWallGeneration = await generateImageWall();
                if (imageWallGeneration.success == true) {
                    const message = await sendMessage("Image Wall Genereated SuceesFully");
                    console.log("Image Wall Genereated SuceesFully 🎉", imageWallGeneration.url)
                    stage = "imagePromptGeneration"
                    continue;
                } else {
                    const message = await sendMessage("Image Wall Generation Failed Not Posting Video today");
                    return { message: "Image Wall Generation Failed Not Posting Video today" }
                }
            }

            // STAGE 5

            if (stage === "imagePromptGeneration") {
                console.log("------------- Image Prompt Generation Started --------------");
                console.log(`Stage : ${stage}`);
                const imagePromptGeneration = await generateImagePrompts();
                if (imagePromptGeneration.success == true) {
                    const message = await sendMessage("Image Prompt Genereated SuceesFully");
                    console.log("Image Prompt Genereated SuceesFully 🎉", imagePromptGeneration.url)
                    stage = "imageGeneration"
                    continue;
                } else {
                    const message = await sendMessage("Image Prompt  Generation Failed Not Posting Video today");
                    return { message: "Image Prompt  Generation Failed Not Posting Video today" }
                }
            }

            // STAGE 6

            if (stage === "imageGeneration") {
                console.log("---------------- Image Generation Started -------------------")
                console.log(`Stage : ${stage}`);
                const imageGeneration = await generateImage();
                if (imageGeneration.success == true) {
                    const message = await sendMessage("Image Genereated SuceesFully");
                    console.log("Image  Genereated SuceesFully 🎉", imageGeneration.url)
                    stage = "githubUpload"
                    continue;
                } else {
                    const message = await sendMessage("Image Generation Failed Not Posting Video today");
                    return { message: "Image Generation Failed Not Posting Video today" }
                }
            }

            // STAGE 7

            if (stage === "githubUpload") {
                console.log("---------------- Github Upload Started -------------------")
                console.log(`Stage : ${stage}`);
                const startGithubTriger = await githubTriger();
                if (startGithubTriger.success == true) {
                    const message = await sendMessage("Github Triggered SuceesFully");
                    console.log("Github Triggered SuceesFully 🎉", startGithubTriger.message)
                    return;
                } else {
                    const message = await sendMessage("Github Trigger Failed Not Posting Video today");
                    return { message: "Github Trigger Failed Not Posting Video today" }
                }
            }
        }
    } catch (error) {
        console.log(`Error in Workflow ${error}`)
    } finally {
        workFlowRunning = false;
        console.log("Workflow completed ✅ Worflow lock Released 🔒")
    }

}