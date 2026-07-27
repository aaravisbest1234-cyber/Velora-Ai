from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
import os


load_dotenv()


router = APIRouter()


# Groq client
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)



# Request format
class ChatRequest(BaseModel):
    message: str



# Velora personality
SYSTEM_PROMPT = """
You are Velora AI.

You are a smart, friendly AI assistant.
Give clear and helpful answers.
Keep responses natural and easy to understand.
"""



@router.post("/chat")
async def chat(data: ChatRequest):

    try:

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",

            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT
                },
                {
                    "role": "user",
                    "content": data.message
                }
            ]
        )


        return {
            "response": response.choices[0].message.content
        }


    except Exception as e:

        return {
            "response": f"Velora error: {str(e)}"
        }