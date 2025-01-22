'''
App.py:
- Server for NLP requests

'''

from flask import Flask, render_template, url_for, request, jsonify, Response, send_file
from flask_cors import CORS
app = Flask(__name__, template_folder="public")
CORS(app)

import os
from openai import OpenAI
import requests, io
from dotenv import load_dotenv


#chatbot setup
load_dotenv()
API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI()

conversations = {}  #(user_id, conversation)


#FUNCTIONS
def getEmoji():
  pass


def getEmotions(text):
  prompt = '''Given a message/text/question, you will only reply the main emotions expressed in it seperated by only commas. 
  You may put spaces if an emotion contains more than one word.
  Make sure that the emotions are feelings. For example:
  'I love pies! Pumpkin pie is my favourite. I can't wait to go to bakery to get some pie!'

  Main emotions: love, excited
  '''
  '''
  resp = bot.invoke(prompt)
  resp = bot.invoke(text)
  return resp['response'].split(', ')
  '''


#smth wrong with API
def getToneInfo(text):
  url = "https://twinword-twinword-bundle-v1.p.rapidapi.com/sentiment_analyze/"
  querystring = {"text": text}
  headers = {
    "X-RapidAPI-Key": "e3938739a7msh9e96af120838cd6p124f95jsncd04a2b21318",
    "X-RapidAPI-Host": "twinword-twinword-bundle-v1.p.rapidapi.com"
  }

  toneInfo = requests.get(url, headers=headers, params=querystring).json()  #properties are strings
  return toneInfo


def gptGetTone(text):
  conversation_history = [
  {"role": "developer",
   "content": "You will return the sentiment of a piece of text as 'positive', 'neutral', 'serious', or 'excited' (don't include quotes). Return 'excited' if the piece of text is positive & includes a '!' "}
  ]

  conversation_history.append({"role": "user", "content": text})

  completion = client.chat.completions.create(model="gpt-4o", messages=conversation_history)
  tone = completion.choices[0].message.content
  return tone


def getBotReply(message, user_id):
  global conversations
  conversation = conversations[user_id]
  conversation_history = [
  {"role": "developer",
   "content": "You are having a conversation. You will be given the past conversation between the user and you (bot). You will answer the last user's message please. Also please avoid using special formatting characters like asterisks."}
  ]

  conversation += ' user: ' + message + '.'
  print('conversation: ' + conversation)
  conversation_history.append({"role": "user", "content": conversation})

  completion = client.chat.completions.create(model="gpt-4o", messages=conversation_history)
  reply = completion.choices[0].message.content
  conversation += ' bot: ' + reply + '.'
  conversations[user_id] = conversation

  return reply


#Google's TTS
from google.cloud import texttospeech

def googleTTS(text):
  client = texttospeech.TextToSpeechClient.from_service_account_file('./assets/textToSpeechKey.json')
  synthesis_input = texttospeech.SynthesisInput(text=text)
  voice = texttospeech.VoiceSelectionParams(language_code="en-US", name="en-US-Standard-I", ssml_gender=texttospeech.SsmlVoiceGender.MALE)
  audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)

  response = client.synthesize_speech(input=synthesis_input, voice=voice, audio_config=audio_config)

  # with open("googleSpeech.mp3", "wb") as out:
  #   out.write(response.audio_content)  #write binary string to file

  return response.audio_content
      

#routes
@app.route("/")
def home():
  return render_template("textChat.html")

@app.route("/textChat")
def textChat():
  return render_template("textChat.html")

@app.route("/audioChat")
def audioChat():
  return render_template("audioChat.html")


@app.route("/botReply", methods=['POST'])
def botReply():
  json = request.get_json()
  message = json.get('message')
  user_id = json.get('userID')

  if user_id not in conversations.keys():
    print('Adding user ' + user_id)
    conversations[user_id] = ''

  reply = getBotReply(message, user_id)
  print('reply: ' + reply)
  return jsonify({'reply': reply})


@app.route('/getSpeech', methods=['POST'])
def getSpeech():
  text = request.get_json().get('text')
  audioBinary = googleTTS(text)
  
  return send_file(
    io.BytesIO(audioBinary), mimetype="audio/mpeg", as_attachment=False, download_name="botSpeech.mp3"
  )


@app.route('/getTone', methods=['POST'])
def getTone():
  text = request.get_json().get('text')
  tone = gptGetTone(text)
  return jsonify({'tone': tone})


'''
@app.route('/getTone', methods=['POST'])
def getTone():
  text = request.get_json().get('text')
  toneInfo = getToneInfo(text)
  tone = toneInfo['type']
  print("Text: " + text)
  
  if toneInfo['score'] >= 0 and text[len(text) - 1] == '!': tone = 'excited'
  elif toneInfo['score'] < -0.2: tone = 'serious'
  elif toneInfo['score'] >= -0.2 and toneInfo['score'] < 0.3: tone = 'neutral'
  else: tone = 'positive' 

  print(f'Tone: {tone} | score: {toneInfo['score']}', end='\n')
  return jsonify({'tone': tone})
'''


@app.route("/test", methods=["POST"])
def test():
  data = request.get_json() 
  print("Rec " + str(data))

  resp = {"message": "Thanks"}
  return jsonify(resp)


if __name__ == "__main__":
  app.run(port=7000, debug=True)


