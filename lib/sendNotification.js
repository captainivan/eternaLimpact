

export const sendMessage = async (message) => {
    try {
        await fetch("https://ntfy.sh/eternaL-impact-messages-2468", {
            method: "POST",
            body: message
        });
    } catch (error) {
        console.log(error);
    }
}