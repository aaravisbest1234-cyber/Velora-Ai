const sendBtn = document.getElementById("send");
const input = document.getElementById("message");
const chat = document.getElementById("chat-container");
const welcome = document.getElementById("welcome");
const orb = document.querySelector(".orb");
const historyList = document.getElementById("history-list");



let history = JSON.parse(localStorage.getItem("velora_history")) || [];

loadHistory();



function saveHistory(text){

    history.push(text);

    localStorage.setItem(
        "velora_history",
        JSON.stringify(history)
    );

    loadHistory();

}




function loadHistory(){

    historyList.innerHTML="";


    history.slice(-10).reverse().forEach(item=>{


        let btn=document.createElement("button");

        btn.className="history-item";

        btn.innerText=item.substring(0,25)+"...";


        historyList.appendChild(btn);


    });

}




function addMessage(text,type){


    const div=document.createElement("div");


    div.className="message "+type;


    chat.appendChild(div);



    // letter animation

    let words=text.split(" ");


    let i=0;


    let interval=setInterval(()=>{


        if(i>=words.length){

            clearInterval(interval);

            return;

        }



        let span=document.createElement("span");


        span.className="word";


        span.innerText=words[i]+" ";


        div.appendChild(span);


        i++;



        chat.scrollTop=chat.scrollHeight;



    },80);



}




function typingAnimation(){


    const div=document.createElement("div");


    div.className="message ai typing";


    div.innerHTML=`

    <span></span>
    <span></span>
    <span></span>

    `;


    chat.appendChild(div);


    return div;


}






async function sendMessage(){


    let message=input.value.trim();


    if(!message)return;



    welcome.classList.add("fade-out");



    addMessage(message,"user");


    saveHistory(message);



    input.value="";



    orb.classList.add("thinking");



    let typing=typingAnimation();



    try{


        let res=await fetch("/chat",{


            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },


            body:JSON.stringify({

                message:message

            })


        });



        let data=await res.json();



        typing.remove();



        orb.classList.remove("thinking");

        orb.classList.add("replying");



        addMessage(
            data.reply,
            "ai"
        );



        setTimeout(()=>{


            orb.classList.remove("replying");


        },1500);



    }


    catch(err){


        typing.remove();


        orb.classList.remove("thinking");


        addMessage(
            "Something went wrong.",
            "ai"
        );


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





document.getElementById("new-chat").onclick=()=>{


chat.innerHTML="";

welcome.classList.remove("fade-out");


};