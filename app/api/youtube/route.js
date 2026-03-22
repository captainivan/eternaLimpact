import { runWorkFlow } from "./workFlow";


export async function POST() {
    try {
        runWorkFlow("githubUpload");

        return Response.json({
            message:"success",
            status:"Workflow Started"
        })
    } catch (error) {
        console.log(error)
        return Response.json({message:error})
    }
}