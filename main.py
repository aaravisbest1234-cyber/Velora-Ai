from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from groq import Groq
from dotenv import load_dotenv
import os


load_dotenv()


app = FastAPI()


# Static files (CSS, JS)
app.mount(
    "/static",
    StaticFiles(directory="frontend/static"),
    name="static"
)


# HTML templates
templates = Jinja2Templates(
    directory="frontend/templates"
)


# Groq client
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)



# Home page
@app.get("/")
async def home(request: Request):

    return templates.TemplateResponse(
        "index.html",
        {
            "request": request
        }
    )



# Test route
@app.get("/status")
async def status():

    return {
        "status": "Velora AI backend is running 🚀"
    }



# Chat API
@app.post("/chat")
async def chat(request: Request):

    data = await request.json()

    user_message = data.get("message")


    if not user_message:
        return JSONResponse({
            "reply": "Please enter a message."
        })



    response = client.chat.completions.create(

        model="llama-3.3-70b-versatile",

        messages=[

            {
                "role": "system",
                "content":
                "You are Velora AI, a smart helpful assistant."
            },

            {
                "role": "user",
                "content": user_message
            }

        ]

    )


    reply = response.choices[0].message.content


    return JSONResponse({

        "reply": reply

    })