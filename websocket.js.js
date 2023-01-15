const speaknow = async() => {
    navigator.mediaDevices
        .getUserMedia({
            audio: true,
        })
        .then((stream) => {
            console.log({
                stream,
            });
            if (!MediaRecorder.isTypeSupported("audio/webm"))
                return alert("Browser not supported");
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: "audio/webm",
            });
            const socket = new WebSocket(
                "wss://api.deepgram.com/v1/listen?language=tr", ["token", "79c607c5513cd211a99ca6d04fc927b52480f84f"]
            );
            socket.onopen = () => {
                console.log({
                    event: "onopen",
                });
                mediaRecorder.addEventListener("dataavailable", async(event) => {
                    if (event.data.size > 0 && socket.readyState == 1) {
                        socket.send(event.data);
                    }
                });
                mediaRecorder.start(1000);
            };

            socket.onmessage = async(message) => {
                const received = JSON.parse(message.data);
                const transcript = received.channel.alternatives[0].transcript;
                if (transcript && received.is_final) {
                    console.log(transcript);
                    await mediaRecorder.stop();

                    //   ==================
                    sendRequest(transcript);
                    //   ==================
                }
            };

            socket.onclose = () => {
                console.log({
                    event: "onclose",
                });
            };

            socket.onerror = (error) => {
                console.log({
                    event: "onerror",
                    error,
                });
            };
        });
};