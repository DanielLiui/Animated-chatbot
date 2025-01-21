

const botImg = qSel('#bot-img')
const recordButton = qSel('#microphone-button')
const sendButton = qSel('#audio-send-button')
const textChatButton = qSel('#text-mode-button')
const pauseButton = qSel('#pause-animation-button')
const loadDiv = qSel('#load-div')
const audioPlayer = qSel('#audio-player')

let recognition = null
let currAnimation = ['noTalkPositive1.jpg', 'noTalkPositive2.jpg']
let intervalID = null


//FUNCTIONS
/*
Text to speech using Web Speech API:
- Specify how voice will sound and play
- Return utterance obj specifying how voice will sound
*/
function TTS(text) {
  let utterance = null

  if ('speechSynthesis' in window) {
    utterance = new SpeechSynthesisUtterance(text)
    utterance.pitch = 1.5
    utterance.rate = 1
    utterance.volume = 1
    utterance.lang = 'en-US'

    utterance.onstart = function(ev) {}
    utterance.onend = function(ev) {}
    utterance.onerror = function(ev) {}
    window.speechSynthesis.speak(utterance)
  } 
  else {
    alert('Web Speech API is not supported in this browser.')
  }
  return utterance
}
      

async function getTone(text) {
  const resp = await fetch(serverPort + '/getTone', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: text })
  })
  if (!resp.ok) throw new Error("Error getting response from /getTone")

  let toneResp = await resp.json()
  return toneResp.tone
}


function getTalkExpressions(tone) {
  if (tone == 'positive' || tone == 'excited') {
    return ['talkPositive1.jpg', 'talkPositive2.jpg']   
  }
  else if (tone == 'neutral') { 
    return ['talkNeutral1.jpg', 'talkNeutral2.jpg'] 
  }
  else {  //serious
    return ['talkSerious1.jpg', 'talkSerious2.jpg'] 
  }
}


function animationWithTTS(text) {
  let sentences = text.split('. ')
  let utterance = TTS(' ')
  let tone=''

  //play chatbot dialogue for each sentence as well as expressions based on tone
  for (let i = 0; i < sentences.length; i++) {
    getTone(sentences[i]).then(tone => {
      currAnimation = getTalkExpressions(tone) //["imgFile1", "imgFile2", ...]
      
      //wait for last sentence to finish
      utterance.onend = ()=> {
        stopAnimation()
        utterance = TTS(sentences[i])  //once speech api finishes last sentence, it will continue this one
        fidgetyAnimation(currAnimation)

        log('sentence: ' + sentences[i])
        log('tone: ' + tone)
        log('expressions: ' + currAnimation)
      }
    }) 
  }

  //set silent face if done talking
  utterance.onend = ()=> {
    if (tone == 'positive' || tone == 'neutral') {
      currAnimation = ['noTalkPositive1.jpg', 'noTalkPositive2.jpg']
    }
    else if (tone == 'excited') { 
      currAnimation = ['noTalkExcited1.jpg', 'noTalkExcited2.jpg']
    }
    else {  //serious
      currAnimation = ['noTalkNeutral1.jpg', 'noTalkNeutral2.jpg']
    }
    stopAnimation(); fidgetyAnimation(currAnimation)
  }
}


async function animationWithGoogleTTS(text) {
  let tone = ''

  try {
    tone = await getTone(text)
    log('Tone: ' + tone)
    currAnimation = getTalkExpressions(tone)

    const response = await fetch(serverPort + '/getSpeech', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({text: text})
    })

    if (!response.ok) { throw new Error('Failed to fetch audio.') }
    else { log('Audio returned') }

    loadDiv.style.display = "none"
    
    //play audio
    const audioBlob = await response.blob()
    const audioUrl = URL.createObjectURL(audioBlob)
    audioPlayer.src = audioUrl

    audioPlayer.addEventListener('canplaythrough', () => {
      fidgetyAnimation(currAnimation)
      audioPlayer.play().catch(error => {
        console.error('Error playing audio:', error)
      })
    })

    audioPlayer.addEventListener('ended', () => {
      noTalkAnimation(tone)
    })

  } catch (error) {
    console.error('Error:', error)
  }
}


function fidgetyAnimation(imgs) {
  stopAnimation()
  let img_i = 0

  intervalID = setInterval(()=> {
    botImg.src = '/assets/animationImages/' + imgs[img_i];
    img_i = (img_i + 1) % imgs.length
  }, 500)
}


function stopAnimation() {
  clearInterval(intervalID);
}


function noTalkAnimation(tone) {
  if (tone == 'positive' || tone == 'neutral') {
    currAnimation = ['noTalkPositive1.jpg', 'noTalkPositive2.jpg']
  }
  else if (tone == 'excited') { 
    currAnimation = ['noTalkExcited1.jpg', 'noTalkExcited2.jpg']
  }
  else {  //serious
    currAnimation = ['noTalkNeutral1.jpg', 'noTalkNeutral2.jpg']
  }
  stopAnimation(); fidgetyAnimation(currAnimation)
}


async function playVoice(text) {
  try {
      const response = await fetch(serverPort + '/getSpeech', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ text })
      });

      if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
      }

      const audioBlob = await response.blob();
      const audioURL = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioURL);
      audio.play();
  } catch (error) {
      console.error('Failed to play audio:', error);
  }
}


function record() {
  //recordButton.blur()

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  recognition = new SpeechRecognition()
  recognition.continuous = true       //continue recognition even after pauses
  recognition.interimResults = false  //return only final results

  //if recognition hears anything, add it to user's message
  recognition.onresult = (ev) => {

    for (let i = ev.resultIndex; i < ev.results.length; i++) {
      if (ev.results[i].isFinal) {
        message += ev.results[i][0].transcript.trim() + ' '
      }
    }
  }

  recognition.onerror = (ev) => {
    console.error('Speech recognition error', ev.error);
  }
    
  recognition.start()
  recordButton.classList.add('pressed-audio-button')
}


function stopRecording() {
  recognition.stop()
}


function continueRecording() {
  recognition.onresult = (ev) => {

    for (let i = ev.resultIndex; i < ev.results.length; i++) {
      if (ev.results[i].isFinal) {
        message += ev.results[i][0].transcript.trim() + ' '
      }
    }
  }

  recognition.onerror = (ev) => {
    console.error('Speech recognition error', ev.error);
  }
    
  recognition.start()
}


//function returns true if audio button is pressed, else false
function pressed(button) {
  if (button.classList.contains('pressed')) { return true }
  else { return false }
}


function selectButton(button) {
  button.style.backgroundColor = 'rgb(128, 128, 128)'
  button.style.color = 'white'
  button.classList.add('pressed')
}


function unselectButton(button) {
  button.style.backgroundColor = '#007bff'
  button.style.color = 'white'
  button.classList.remove('pressed')
}


//EVENT LISTENERS
document.addEventListener("DOMContentLoaded", () => {
  if (userID == '') userID = makeUUID()
  fidgetyAnimation(currAnimation)

  recordButton.addEventListener('click', (ev) => {     
    //ev.preventDefault()   

    if (!pressed(recordButton)) {
      selectButton(recordButton)
      record()
    }
    else {
      unselectButton(recordButton)
      stopRecording()
      //log(message)
    } 
  })


  sendButton.addEventListener('click', ()=> {
    sendButton.blur();

    if (pressed(recordButton)) {
      unselectButton(recordButton)
      stopRecording()
      recordButton.classList.remove('pressed')
    }

    log("You said: " + message)
    botResponse(message).then((reply)=> { 
      saveUserMessage(message); message = ''
      log('Bot: ' + reply)
      animationWithGoogleTTS(botMessages[botMessages.length - 1])
    })
    //while waiting for response, display loading animation
    loadDiv.style.display = 'flex'; loadDiv.style.flexDirection = 'column'
  })

  /* Can use pause button for testing
  pauseButton.addEventListener('click', ()=> {
    log("User: "); log(userMessages)
    log("Bot: "); log(botMessages)

    if (!pressed(pauseButton)) {  //was not pressed & user clicks button
      if (recognition != null) stopRecording()
      pauseButton.classList.add('pressed')
    } 
    else {  //pause button is pressed
      if (recognition != null) continueRecording()
      pauseButton.classList.remove('pressed')
    }
  })
  */
  /*
  textChatButton.addEventListener('click', (ev)=> {
    window.location.href = '/textChat'
  })
  */
})