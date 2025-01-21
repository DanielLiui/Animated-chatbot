
import os
import requests, io
from pathlib import Path
import openai
from openai import OpenAI
from dotenv import load_dotenv


load_dotenv()
API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI()
conversation_history = [
  {"role": "developer",
   "content": "You are having a conversation. You will be given the past conversation between the user and you (bot). You will answer the last user's message please."}
]
conversation = ""

def botResponse(message):
  global client, conversation_history, conversation

  conversation += ' user: ' + message + '.'
  conversation_history.append({"role": "user", "content": conversation})
  completion = client.chat.completions.create(model="gpt-4o", messages=conversation_history)
  reply = completion.choices[0].message.content
  conversation += ' bot: ' + reply + '.'
  #conversation_history.append({"role": "assistant", "content": reply})  #bot's reply

  return (reply)


#langchain bot
'''
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
import getpass, os
from openai import ChatOpenAI

def langchainBot():

  if not os.environ.get("OPENAI_API_KEY"):
      os.environ["OPENAI_API_KEY"] = getpass.getpass("OpenAI API Key:")

  model = ChatOpenAI(model="gpt-4o-mini")
  messages = []
  prompt = ChatPromptTemplate.from_messages(
    [
    SystemMessage(content="You are a having a conversation."),
    MessagesPlaceholder(variable_name="messages"),
    ] 
  )

  chain = prompt | model
  talking = True

  while talking:
    user_message = input("message: ")
    messages.append(HumanMessage(content=user_message))
    ai_msg = chain.invoke({"messages": messages})
    messages.append(AIMessage(content=ai_msg.content))
    print("bot: " + ai_msg.content)
  
  print(ai_msg.content)
'''

#main
#langchainBot()
#print(botResponse("Hello"))
#print(botResponse("Do you remember the first thing you told me?"))


#routes
@app.route("/")
def home():
  return render_template("textChat.html")

