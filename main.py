from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from groq import Groq
from dotenv import load_dotenv
import os


load_dotenv()


app = FastAPI()


# Serve CSS / JS
app.mount(
    "/static",
    StaticFiles(directory="frontend/static"),
    name="static"
)


# HTML folder
templates = Jinja2Templates(
    directory="frontend/templates"
)


# Groq setup
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)



# Homepage
@app.get("/")
async def home(request: Request):

    return templates.TemplateResponse(
        name="index.html",
        context={
            "request": request
        }
    )



# Health check
@app.get("/status")
async def status():

    return {
        "status": "Velora AI backend is running 🚀"
    }



# Chat endpoint
@app.post("/chat")
async def chat(request: Request):

    data = await request.json()

    user_message = data.get("message")


    if not user_message:

        return JSONResponse(
            {
                "reply": "Please enter a message."
            }
        )



    try:

        response = client.chat.completions.create(

            model="llama-3.3-70b-versatile",

            messages=[
                {
                    "role": "system",
                    "content": "You are Velora AI, a helpful intelligent assistant."
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

        print(e)

        return JSONResponse(
            {
                "reply": "Velora is having trouble connecting 😭"
            },
            status_code=500
        )