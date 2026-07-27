from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from groq import Groq
from dotenv import load_dotenv
import os


load_dotenv()

app = FastAPI()


# Allow Vercel frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://velora-gpt.vercel.app",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Groq setup
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


@app.get("/")
async def home():
    return {
        "status": "Velora AI backend is running 🚀"
    }


@app.post("/chat")
async def chat(request: Request):

    try:
        data = await request.json()

        user_message = data.get("message")

        if not user_message:
            return JSONResponse(
                {
                    "error": "Message missing"
                },
                status_code=400
            )


        response = client.chat.completions.create(

            model="llama-3.3-70b-versatile",

            messages=[
                {
                    "role": "system",
                    "content":
                    "You are Velora AI, a helpful intelligent AI assistant. Answer clearly and naturally."
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

        return JSONResponse(
            {
                "error": str(e)
            },
            status_code=500
        )