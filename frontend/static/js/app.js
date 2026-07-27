const sendBtn = document.getElementById("send");
const input = document.getElementById("message");
const chat = document.getElementById("chat-container");
const welcome = document.getElementById("welcome");
const orb = document.querySelector(".orb");
const historyList = document.getElementById("history-list");

let currentChat = {
    title: "New Chat",
    messages: []
};


// Load saved chat
const saved = localStorage.getItem("velora_current_chat");

if (saved) {
    currentChat = JSON.parse(saved);

    currentChat.messages.forEach(msg => {
        addMessageInstant(msg.text, msg.type);
    });

    updateHistory();
}



function saveChat(){

    localStorage.setItem(
        "velora_current_chat",
        JSON.stringify(currentChat)
    );

}



function updateHistory(){

    historyList.innerHTML = "";

    let btn = document.createElement("button");

    btn.className = "history-item";

    btn.innerText = "📝 " + currentChat.title;

    historyList.appendChild(btn);

}





function addMessageInstant(text,type){

    let div=document.createElement("div");

    div.className="message "+type;

    div.innerText=text;

    chat.appendChild(div);

}




// Smooth AI typing

function addMessage(text,type){

    let div=document.createElement("div");

    div.className="message "+type;

    chat.appendChild(div);


    let words=text.split(" ");

    let i=0;


    let timer=setInterval(()=>{


        if(i>=words.length){

            clearInterval(timer);

            return;

        }


        let span=document.createElement("span");

        span.className="word";

        span.innerText=words[i]+" ";

        div.appendChild(span);


        i++;

        chat.scrollTop=chat.scrollHeight;


    },60);


    currentChat.messages.push({

        text:text,
        type:type

    });


    saveChat();

}





function showTyping(){


    let div=document.createElement("div");

    div.className="message ai typing";


    div.innerHTML=`

    <span></span>
    <span></span>
    <span></span>

    `;


    chat.appendChild(div);


    return div;

}





async function analyzeTitle(){


    if(currentChat.messages.length < 4) return;


    if(currentChat.title !== "New Chat") return;



    let first = currentChat.messages[0].text;


    currentChat.title =
        first.substring(0,30);



    updateHistory();

    saveChat();


}






async function sendMessage(){


    let text=input.value.trim();


    if(!text) return;



    welcome.classList.add("fade-out");


    addMessage(
        text,
        "user"
    );


    input.value="";



    orb.classList.add("thinking");



    let typing = showTyping();



    try{


        let response = await fetch("/chat",{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                message:text

            })

        });



        let data = await response.json();



        typing.remove();



        orb.classList.remove("thinking");

        orb.classList.add("replying");



        addMessage(
            data.reply,
            "ai"
        );



        analyzeTitle();



        setTimeout(()=>{

            orb.classList.remove("replying");

        },1200);



    }


    catch(error){


        typing.remove();

        orb.classList.remove("thinking");


        addMessage(
            "Connection error.",
            "ai"
        );


        console.log(error);


    }


}





sendBtn.onclick = sendMessage;



input.addEventListener(
"keydown",
(e)=>{

    if(e.key==="Enter" && !e.shiftKey){

        e.preventDefault();

        sendMessage();

    }

});






document.getElementById("new-chat").onclick=()=>{


    currentChat={

        title:"New Chat",

        messages:[]

    };


    localStorage.removeItem(
        "velora_current_chat"
    );


    chat.innerHTML="";


    welcome.classList.remove(
        "fade-out"
    );


    updateHistory();


};