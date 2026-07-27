const API_URL = "https://velora-ai-v8k8.onrender.com/chat";


const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");



function addMessage(text, sender) {

    const message = document.createElement("div");

    message.className = sender;

    message.innerText = text;

    chatBox.appendChild(message);

    chatBox.scrollTop = chatBox.scrollHeight;
}




async function sendMessage() {

    const message = input.value.trim();


    if (!message) return;


    addMessage(message, "user");


    input.value = "";


    addMessage("Thinking...", "bot");


    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })

        });



        const data = await response.json();


        // remove Thinking...
        chatBox.lastChild.remove();



        if (data.reply) {

            addMessage(data.reply, "bot");

        } else {

            addMessage("Something went wrong 😕", "bot");

        }


    } catch (error) {


        chatBox.lastChild.remove();


        addMessage(
            "Server error. Try again later.",
            "bot"
        );


        console.error(error);

    }

}



sendBtn.addEventListener(
    "click",
    sendMessage
);



input.addEventListener(
    "keydown",
    function(event){

        if(event.key === "Enter"){

            sendMessage();

        }

    }
);