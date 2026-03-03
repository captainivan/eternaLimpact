import { runWorkFlow } from "./workFlow";


export async function POST() {
    try {
        runWorkFlow("basicVideoDataGeneration");

        return Response.json({
            message:"success",
            status:"Workflow Started"
        })
    } catch (error) {
        console.log(error)
        return Response.json({message:error})
    }
}