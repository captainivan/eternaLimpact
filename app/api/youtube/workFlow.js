import { generateAudio } from "@/lib/generateAudio";
import { generateVideoBasicData } from "@/lib/generateBasicVideoData";

let workFlowRunning = false;

export const runWorkFlow = async (initialStage) => {

    if(workFlowRunning){
        console.log("Workflow is already Runing wait second request denied 😤")
        return;
    }

    workFlowRunning = true;

    try {
      
        console.log(`------- WorkFlow Started --------`);

        let stage = initialStage;

        while (stage) {

            console.log(`Stage : ${stage}`)

            // STAGE 1

            if(stage === "basicVideoDataGeneration"){
                const basicData = await generateVideoBasicData();
                console.log("basicData Genereated SuceesFully 🎉",basicData.title)
                stage = "audiogeneration"
                continue;
            }

            // STAGE 2

            if(stage === "audiogeneration"){
                const audioGeneration = await generateAudio();
                console.log("Audio Generated SuceesFully 🎉",audioGeneration)
                return
            }


        }
        
        
    } catch (error) {
        console.log(`Error in Workflow ${error}`)
    }finally{
        workFlowRunning = false;
        console.log("Workflow completed ✅ Worflow lock Released 🔒")
    }

}