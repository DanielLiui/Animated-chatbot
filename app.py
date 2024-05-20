

from flask import Flask, render_template, url_for, request, jsonify
app = Flask(__name__)
import os
import requests

#AI setup
from langchain_openai import ChatOpenAI
from langchain.prompts.chat import ChatPromptTemplate
from langchain.schema import BaseOutputParser
from dotenv import load_dotenv
from langchain.chains import ConversationChain


load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
mdl = ChatOpenAI(openai_api_key=api_key)
bot = ConversationChain(llm=mdl)


#AI functs
def getEmotions(text):
  emotionBot = ConversationChain(llm=mdl)
  prompt = '''Given a message/text/question, you will only reply the main emotions expressed in it seperated by only commas. 
  You may put spaces if an emotion contains more than one word.
  Make sure that the emotions are feelings. For example:
  'I love pies! Pumpkin pie is my favourite. I can't wait to go to bakery to get some pie!'

  Main emotions: love,excited
  '''
  resp = emotionBot.invoke(prompt)
  resp = emotionBot.invoke(text)
  return resp['response'].split(', ')


def getEmoji(text):
  url = "https://emoji-ai.p.rapidapi.com/getEmoji"
  query = {"query": text}
  headers = {
    "X-RapidAPI-Key": "e3938739a7msh9e96af120838cd6p124f95jsncd04a2b21318",
    "X-RapidAPI-Host": "emoji-ai.p.rapidapi.com"
  }

  resp = requests.get(url, headers=headers, params=query)
  return resp.json()["emoji"]


def chat():
  print("You can start talking to GPT. Enter 'quit' to exit: ")

  while True:
    inp = input()
    if inp == 'quit': break

    respObj = bot.invoke(inp);  
    resp = respObj["response"]
    emotions = getEmotions(resp);  
    emotion_emoji = getEmoji(emotions[0])

    print(f'{resp} {emotion_emoji} \n')
    print(str(emotions), '\n')
    #print(f'{resp} \n')


chat()

#routes
@app.route("/")
def home():
  return render_template("index.html")


@app.route("/test", methods=["POST"])
def test():
  data = request.get_json() 
  print("Rec " + str(data))

  resp = {"message": "Thanks"}
  return jsonify(resp)


if __name__ == "__main__":
  print("Visit: ")
  print("http://127.0.0.1:8000/")
  app.run(port=8000, debug=True)


