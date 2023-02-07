const sendRequestToChatGPT = async(transcript) => {
    await fetch("https://sore-gilet-bass.cyclic.app", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
                    query Chat($question: String) {
                        chat(question: $question)
                    }
                `,
                variables: {
                    question: "merhaba",
                },
            }),
        })
        .then((res) => res.json())
        .then(async(result) => {
            await console.log(result.data.chat.trim());
            await text_to_speech(result.data.chat.trim());
        });
}
