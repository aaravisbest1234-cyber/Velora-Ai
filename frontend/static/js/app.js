const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");


function addMessage(text, sender) {

    const message = document.createElement("div");

    message.className = `message ${sender}`;

    message.innerText = text;

    chatBox.appendChild(message);

    chatBox.scrollTop = chatBox.scrollHeight;
}



async function sendMessage() {

    const text = input.value.trim();

    if (!text) return;


    addMessage(text, "user");

    input.value = "";


    const thinking = document.createElement("div");

    thinking.className = "message bot";

    thinking.innerText = "Velora GPT is thinking...";

    chatBox.appendChild(thinking);



    try {

        const response = await fetch("/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: text
            })

        });



        const data = await response.json();


        thinking.remove();


        if (data.reply) {

            addMessage(data.reply, "bot");

        } else {

            addMessage(
                "No response received.",
                "bot"
            );

        }


    } catch (error) {


        thinking.remove();


        addMessage(
            "⚠️ Cannot connect to Velora GPT.",
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
    function(event) {

        if (event.key === "Enter") {

            sendMessage();

        }

    }
);