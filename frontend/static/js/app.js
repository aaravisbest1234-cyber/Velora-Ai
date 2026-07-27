const sendBtn = document.getElementById("send");
const input = document.getElementById("message");
const chat = document.getElementById("chat-container");
const welcome = document.getElementById("welcome");
const orb = document.querySelector(".orb");


function addMessage(text,type){

    const div=document.createElement("div");

    div.className="message "+type;

    div.innerText=text;

    chat.appendChild(div);

    chat.scrollTop=chat.scrollHeight;
}



async function sendMessage(){


    let message=input.value.trim();


    if(!message) return;


    welcome.classList.add("fade-out");


    addMessage(message,"user");


    input.value="";


    orb.classList.add("thinking");


    try{


        const res=await fetch("/chat",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                message:message

            })

        });



        const data=await res.json();


        orb.classList.remove("thinking");

        orb.classList.add("replying");


        addMessage(data.reply,"ai");


        setTimeout(()=>{

            orb.classList.remove("replying");

        },1000);



    }

    catch(err){


        addMessage(
            "Error connecting to Velora GPT",
            "ai"
        );


        orb.classList.remove("thinking");


        console.log(err);

    }


}



sendBtn.onclick=sendMessage;



input.addEventListener(
"keydown",
(e)=>{


    if(e.key==="Enter" && !e.shiftKey){

        e.preventDefault();

        sendMessage();

    }


});