const API_URL = "https://velora-ai-v8k8.onrender.com/chat";


const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendButton = document.getElementById("send-btn");


function addMessage(message, type) {
    const div = document.createElement("div");

    div.classList.add("message", type);

    div.textContent = message;

    chatBox.appendChild(div);

    chatBox.scrollTop = chatBox.scrollHeight;
}



async function sendMessage() {

    const message = input.value.trim();

    if (!message) return;


    addMessage(message, "user");

    input.value = "";


    const loading = document.createElement("div");
    loading.classList.add("message", "bot");
    loading.textContent = "Velora is thinking...";

    chatBox.appendChild(loading);



    try {

        const res = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })

        });



        const data = await res.json();


        loading.remove();


        if (data.reply) {

            addMessage(data.reply, "bot");

        } else {

            addMessage(
                "No response received.",
                "bot"
            );

        }



    } catch (error) {

        loading.remove();

        addMessage(
            "⚠️ Cannot connect to Velora server.",
            "bot"
        );

        console.error(error);

    }

}



sendButton.addEventListener(
    "click",
    sendMessage
);



input.addEventListener(
    "keydown",
    (e) => {

        if (e.key === "Enter") {

            sendMessage();

        }

    }
);