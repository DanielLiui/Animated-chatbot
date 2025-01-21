from flask import Flask, render_template, url_for, request, jsonify, Response, session, send_file
from flask_cors import CORS
from flask_session import Session
app = Flask(__name__, template_folder="public")
app.secret_key = 'your_secret_key'  #for session cookies
app.config['SESSION_TYPE'] = 'filesystem' 
CORS(app)
Session(app)

import os
import requests, io
from openai import OpenAI
from dotenv import load_dotenv

#openai chatbot setup
load_dotenv()
API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI()

conversations = {}  #(user_id, conversation)


#FUNCTIONS
def getBotReply(message, user_id):
  global conversations
  conversation = conversations[user_id]
  conversation_history = [
  {"role": "developer",
   "content": "You are having a conversation. You will be given the past conversation between the user and you (bot). You will answer the last user's message please."}
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
  client = texttospeech.TextToSpeechClient()
  synthesis_input = texttospeech.SynthesisInput(text=text)
  voice = texttospeech.VoiceSelectionParams(language_code="en-US", name="en-US-Standard-I", ssml_gender=texttospeech.SsmlVoiceGender.MALE)
  audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)

  response = client.synthesize_speech(input=synthesis_input, voice=voice, audio_config=audio_config)

  # with open("googleSpeech.mp3", "wb") as out:
  #   out.write(response.audio_content)  #write binary string to file

  return response.audio_content



#ROUTES
@app.route("/")
def home():
  return render_template("textChat.html")  #path relative to templates folder (by default app.py renders .html files from there)


@app.route("/botReply", methods=['POST'])
def botReply():
  message = request.get_json()['message']
  user_id = ''

  if 'user_id' not in session:
    user_id = f"user_{request.remote_addr}_{len(session)}"
    session['user_id'] = user_id
    print('Adding user ' + user_id)
    conversations[user_id] = ''

  else:
    user_id = session['user_id']

  reply = getBotReply(message, user_id)
  print('reply: ' + reply)
  return jsonify({'reply': reply})


@app.route('/getSpeech', methods=['POST'])
def getSpeech():
  text = request.get_json()['text']
  audioBinary = googleTTS(text)
  
  return send_file(
    io.BytesIO(audioBinary), mimetype="audio/mpeg", as_attachment=False, download_name="botSpeech.mp3"
  )


if __name__ == "__main__":
  print("Visit: ")
  print("http://127.0.0.1:7000/")
  app.run(port=7000, debug=True)


