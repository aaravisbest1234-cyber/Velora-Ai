from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from groq import Groq
from dotenv import load_dotenv
import os


load_dotenv()

app = FastAPI()


# Static files (CSS + JS)
app.mount(
    "/static",
    StaticFiles(directory="frontend/static"),
    name="static"
)


# Templates
templates = Jinja2Templates(
    directory="frontend/templates"
)


# Groq AI
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)



# Website homepage
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
        "status": "Velora AI is running 🚀"
    }



# AI Chat
@app.post("/chat")
async def chat(request: Request):

    try:

        data = await request.json()

        user_message = data.get("message")


        if not user_message:

            return JSONResponse(
                {
                    "reply": "Please type something."
                }
            )


        response = client.chat.completions.create(

            model="llama-3.3-70b-versatile",

            messages=[
                {
                    "role": "system",
                    "content": "You are Velora AI, a smart and helpful assistant."
                },
                {
                    "role": "user",
                    "content": user_message
                }
            ]
        )


        reply = response.choices[0].message.content


        return {
            "reply": reply
        }


    except Exception as e:

        print("ERROR:", e)

        return JSONResponse(
            {
                "reply": "Velora is having a server issue right now."
            },
            status_code=500
        )