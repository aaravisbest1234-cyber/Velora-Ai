const sendBtn = document.getElementById("send");
const input = document.getElementById("message");

const welcome = document.getElementById("welcome");
const chat = document.getElementById("chat-container");

const orb = document.querySelector(".orb");

const historyBox = document.getElementById("chat-history");
const newChatBtn = document.getElementById("new-chat");


let chats = JSON.parse(
    localStorage.getItem("veloraChats")
) || [];


let currentChat = [];

let chatSaved = false;



loadHistory();




// SEND

sendBtn.addEventListener("click", () => {

    sendMessage();

});



input.addEventListener("keydown", (e)=>{

    if(e.key === "Enter" && !e.shiftKey){

        e.preventDefault();

        sendMessage();

    }

});




// NEW CHAT

if(newChatBtn){

    newChatBtn.addEventListener("click",()=>{


        currentChat = [];

        chatSaved = false;


        chat.innerHTML = "";


        welcome.classList.remove("fade-out");


    });

}







async function sendMessage(){


    const text = input.value.trim();



    if(!text) return;



    chatSaved = false;



    welcome.classList.add("fade-out");



    addMessage(text,"user");



    currentChat.push({

        role:"user",

        text:text

    });



    input.value = "";





    const aiBubble = document.createElement("div");


    aiBubble.className="message ai";



    aiBubble.innerHTML = `

        <div class="typing">

            <span></span>
            <span></span>
            <span></span>

        </div>

    `;



    chat.appendChild(aiBubble);





    orb?.classList.remove("replying");

    orb?.classList.add("thinking");





    try {


        const response = await fetch("/chat",{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },


            body:JSON.stringify({

                message:text

            })

        });





        const data = await response.json();



        aiBubble.innerHTML="";



        orb?.classList.remove("thinking");

        orb?.classList.add("replying");




        currentChat.push({

            role:"ai",

            text:data.reply

        });




        typeAI(data.reply,aiBubble);



    }



    catch(error){


        console.error(error);


        aiBubble.innerText =
        "Something went wrong.";


        orb?.classList.remove("thinking");


    }


}









function addMessage(text,type){


    const bubble=document.createElement("div");


    bubble.className="message "+type;


    bubble.textContent=text;


    chat.appendChild(bubble);


    chat.scrollTop=chat.scrollHeight;


}









function typeAI(text,bubble){


    const words =
    text.split(" ");



    let index=0;



    function next(){



        if(index >= words.length){


            orb?.classList.remove("replying");


            saveChat();


            return;


        }




        const span=document.createElement("span");


        span.className="word";


        span.textContent =
        (index===0 ? "" : " ")
        + words[index];



        bubble.appendChild(span);



        index++;



        chat.scrollTop =
        chat.scrollHeight;



        setTimeout(next,90);


    }



    next();


}









async function saveChat(){


    if(chatSaved) return;


    if(currentChat.length < 2) return;



    const title = await generateTitle();




    chats.unshift({

        title:title,

        messages:[...currentChat]

    });



    chats = chats.slice(0,10);



    localStorage.setItem(

        "veloraChats",

        JSON.stringify(chats)

    );



    chatSaved=true;



    loadHistory();


}









async function generateTitle(){


    try{


        const response = await fetch("/chat",{


            method:"POST",


            headers:{


                "Content-Type":"application/json"


            },


            body:JSON.stringify({


                message:`

Make a short title (max 5 words)

for this conversation:

${currentChat[0].text}

Only return the title.

                `


            })


        });




        const data =
        await response.json();




        return data.reply.trim();



    }


    catch(error){


        return "New Conversation";


    }


}









function loadHistory(){


    if(!historyBox) return;



    historyBox.innerHTML="";



    chats.forEach((item,index)=>{


        const button =
        document.createElement("button");



        button.className="history-item";


        button.innerText=item.title;



        button.onclick=()=>{


            loadChat(index);


        };



        historyBox.appendChild(button);



    });


}









function loadChat(index){


    const selected =
    chats[index];



    chat.innerHTML="";



    currentChat =
    [...selected.messages];



    chatSaved=true;



    selected.messages.forEach(msg=>{


        addMessage(

            msg.text,

            msg.role==="user"
            ? "user"
            : "ai"

        );


    });


}