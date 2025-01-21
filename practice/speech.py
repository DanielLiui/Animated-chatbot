from flask import Flask, request, send_file
app = Flask(__name__)

import os
from langchain_openai import ChatOpenAI
import requests, io
from pathlib import Path
import openai
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("OPENAI_API_KEY")

def openAISpeech(text):
    response = requests.post(
        "https://api.openai.com/v1/audio/text-to-speech",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "input": {"text": text},
            "voice": "alloy"
        }
    )

    if response.status_code != 200:
        return {"error": response.text}, response.status_code

    audio_content = response.content
    
    audio_file = "speech.mp3"

    try:
      file = open(audio_file, "wb")
      file.write(audio_content)
      file.close()
    
    except Exception as e:
       print(f"Error writing file: {e}")

    return audio_content


def openAI_rapidAPI_speech(text):
  url = "https://open-ai-text-to-speech1.p.rapidapi.com/"

  payload = {
    "model": "tts-1",
    "input": text,
    "voice": "alloy"
  }
  headers = {
    "x-rapidapi-key": "e3938739a7msh9e96af120838cd6p124f95jsncd04a2b21318",
    "x-rapidapi-host": "open-ai-text-to-speech1.p.rapidapi.com",
    "Content-Type": "application/json"
  }

  response = requests.post(url, json=payload, headers=headers)
  print(response.json())


def getAWSVoices():
  url = "https://realistic-text-to-speech.p.rapidapi.com/v3/get_all_v2_voices"
  headers = {
    "x-rapidapi-key": "e3938739a7msh9e96af120838cd6p124f95jsncd04a2b21318",
    "x-rapidapi-host": "realistic-text-to-speech.p.rapidapi.com"
  }
  response = requests.get(url, headers=headers)
  print(response.json())


def realisticTTS(text):
  url = "https://realistic-text-to-speech.p.rapidapi.com/v3/generate_voice_over_v2"
  payload = {
  "voice_obj": {
    "id": 2014,
    "voice_id": "en-US-Neural2-A",
    "gender": "Male",
    "language_code": "en-US",
    "language_name": "US English",
    "voice_name": "Stephen",
    "sample_text": "Hello, hope you are having a great time making your video.",
    "sample_audio_url": "https://s3.ap-south-1.amazonaws.com/invideo-uploads-ap-south-1/speechen-US-Neural2-A16831901130600.mp3",
    "status": 2,
    "rank": 0,
    "type": "google_tts",
    "isPlaying": False
  },
  "json_data": [
    {
    "block_index": 0,
    "text": text
    }
  ]
  }
  headers = {
    "x-rapidapi-key": "e3938739a7msh9e96af120838cd6p124f95jsncd04a2b21318",
    "x-rapidapi-host": "realistic-text-to-speech.p.rapidapi.com",
    "Content-Type": "application/json"
  }
  response = requests.post(url, json=payload, headers=headers)
  
  if response.status_code != 200:
    print(f"Error: {response.status_code} - {response.text}")
    return None

  audio_content = response.content
  return io.BytesIO(audio_content)


#Google's TTS
from google.cloud import texttospeech

def googleTTS(text):
  client = texttospeech.TextToSpeechClient()
  synthesis_input = texttospeech.SynthesisInput(text=text)
  voice = texttospeech.VoiceSelectionParams(language_code="en-US", name="en-US-Standard-I", ssml_gender=texttospeech.SsmlVoiceGender.MALE)
  audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)

  response = client.synthesize_speech(input=synthesis_input, voice=voice, audio_config=audio_config)
  print("resp: " + str(response))

  # with open("googleSpeech.mp3", "wb") as out:
  #   out.write(response.audio_content)  #write binary string to file

  return response.audio_content


#main
googleTTS('To select another voice in Google Text-to-Speech API, you need to modify the VoiceSelectionParams by specifying a different voice name')


@app.route('/getSpeech', methods=['POST'])
def getSpeech():
  text = request.get_json()['text']
  audioBinary = googleTTS(text)
  
  return send_file(
    io.BytesIO(audioBinary),
    mimetype="audio/mpeg",
    as_attachment=False,
    download_name="botSpeech.mp3"
  )


if __name__ == "__main__":
  app.run(port=6000, debug=True)