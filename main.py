from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from groq import Groq
from dotenv import load_dotenv
import os


load_dotenv()


app = FastAPI()



app.mount(
    "/static",
    StaticFiles(directory="frontend/static"),
    name="static"
)



templates = Jinja2Templates(
    directory="frontend/templates"
)



client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)





@app.get("/")
async def home(request: Request):

    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={}
    )






@app.post("/chat")
async def chat(request: Request):

    data = await request.json()

    user_message = data["message"]



    response = client.chat.completions.create(

        model="llama-3.3-70b-versatile",

        messages=[

            {
                "role":"system",
                "content":
                "You are Velora AI, a helpful intelligent assistant."
            },


            {
                "role":"user",
                "content":user_message
            }

        ]

    )


    reply = response.choices[0].message.content



    return JSONResponse({

        "reply":reply

    })