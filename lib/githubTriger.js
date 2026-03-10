
export const githubTriger = async ()=> {
    try {
        const api = await fetch(`https://eternal-impact-render.vercel.app/api/demo-trigger`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            }
        });
        const res = await api.json();
        return {success:true,message:res}
    } catch (error) {
        console.log(error);
        return {success:false,message:error}
    }
}