from openai import OpenAI
import os

from dotenv import load_dotenv
load_dotenv()


client=OpenAI()

messages=[
    {
        "role":"system", 
        "content":"You are a Helpful dailylife assistant bot. You help users with their daily life tasks and provide useful information. Be polite and concise in your responses."
    }
]
print("\n\t-----------------------------------")
print("\t\tWelcome to the Chatbot!")
print("\t-----------------------------------")
print("Type 'exit' or 'quit' to end the conversation.")
print("\n")
print("Chatbot: Hello! How can I assist you today?")


while True:
    try:
        inp=input("User: ").strip()
        if inp.lower() in['exit','quit',None,'']:
            print("Chatbot: Goodbye! 👋")
            break

        messages.append(
            {
                "role":"user",
                "content":inp
            }
        )

        response=client.chat.completions.create(
            model="openai/gpt-oss-20b:free",
            messages=messages
        )

        op=response.choices[0].message.content

        messages.append(
            {
                "role":"assistant",
                "content":op
            }
        )

        print(f"Chatbot: {op}")


    except Exception as e:
        print(f"Error: {e}")
