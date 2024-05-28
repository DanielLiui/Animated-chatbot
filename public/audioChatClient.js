

document.addEventListener("DOMContentLoaded", () => {
  const recordButton = document.getElementById('microphone-button');
  const sendButton = document.querySelector("#audio-send-button");
  const botImg = document.querySelector("#bot-img");

  let botResp = "";
  let recognition;

  // Check for SpeechRecognition API
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();

  // Configure recognition settings
  recognition.continuous = true; // Continue recognition even after pauses
  recognition.interimResults = false; // Return only final results

  // Array to store the transcript
  let transcript = "";

  // Handle results from recognition
  recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
              transcript += event.results[i][0].transcript.trim() + ' ';
          }
      }
      console.log(transcript)
  };

  // Handle recognition errors
  recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
  };

  function TTS(text) {
      let utterance = null

      if ('speechSynthesis' in window) {
          utterance = new SpeechSynthesisUtterance(text)
          utterance.pitch = 1.5
          utterance.rate = 1
          utterance.volume = 1
          utterance.lang = 'en-US'

          utterance.onstart = function(ev) {
              
          }

          utterance.onend = function(ev) {
              
          }

          utterance.onerror = function(ev) {
              
          }

          window.speechSynthesis.speak(utterance)
      } 
      else {
          alert('Web Speech API is not supported in this browser.')
      }
      return utterance
  }


  function getTone(text) {
    return new Promise((resolve, reject) => { 
      fetch(serverPort + '/getTone', {
        method: 'POST', headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({text: text})

      }).then((resp) => {
        if (resp.status != 200) throw new Error("Error getting response from /getTone")
        return resp.json()

      }).then((toneInfo)=> {
        //log("Resp from server: " + JSON.stringify(toneInfo))

        if (toneInfo.type == 'positive' && text[text.length - 1] == '!') {
          resolve('excited')
        }
        else if (toneInfo.type == 'negative') {
          resolve('serious')
        }
        else {
          resolve(toneInfo.type)
        }

      }).catch((err)=> {
        reject(err)
      })
    })
  }
  

  // function getTone(text) {
  //   getToneHelper(text).then(tone => {
  //     return tone
  //   })
  // }


  function getExpressionImg(tone) {
    if (tone == 'positive') {
      return 'talkPositive.jpg'  
    }
    else if (tone == 'neutral') { 
      return 'talkNeutral.jpg'
    }
    else {  //serious
      return 'talkSerious.jpg'
    }
  }


  function animationWithTTS(text) {
    let sentences = text.split('. ')
    let tone = ''
    let utterance = null

    //static animation
    for (let i = 0; i < sentences.length; i++) {
      getTone(sentences[i]).then(tone => {
        let expressionFilename = getExpressionImg(tone) 
        utterance = TTS(sentences[i])
        botImg.src = '../assets/animationImages/' + expressionFilename

        log('sentence: ' + sentences[i])
        log('tone: ' + tone)
        log('expression file: ' + expressionFilename)

        //set silent img if done talking
        if (i === sentences.length - 1) {
          utterance.onend = function(ev) {
            botImg.src = '../assets/animationImages/'

            if (tone == 'positive' || tone == 'neutral') {
              botImg.src += 'noTalkPositive.jpg'  
            }
            else if (tone == 'excited') { 
              botImg.src += 'noTalkExcited.jpg'
            }
            else {  //serious
              botImg.src += 'noTalkSerious.jpg'
            }
          }
        }
      }) 
    }
  }


  /*
  function animationWithTTS(text) {
    let sentences = text.split('. ')
    let tone = ''
    let utterance = null

    //static animation
    for (let sentence of sentences) {
      getTone(sentence).then(tone => {
        let expressionFilename = getExpressionImg(tone) 
        utterance = TTS(sentence)
        botImg.src = '../assets/animationImages/' + expressionFilename

        log('sentence: ' + sentence)
        log('tone: ' + tone)
        log('expression file: ' + expressionFilename)
      }) 
    }

    //fidgety animation
    for (sentence in sentences) {
      tone = getTone(sentence)  
      let expressionImgs = getExpressions(tone) //
      utterance = TTS(sentence)
      fidgetyAnimation(expressionImgs)
    }
    
    //display silent expression based on last tone
    utterance.onend = function(ev) {
      botImg.src = '../assets/animationImages/'

      if (tone == 'positive' || tone == 'neutral') {
        botImg.src += 'noTalkPositive.jpg'  
      }
      else if (tone == 'excited') { 
        botImg.src += 'noTalkExcited.jpg'
      }
      else {  //serious
        botImg.src += 'noTalkSerious.jpg'
      }
    }
    
      
  }
  */

  function fidgetyAnimation(imgs) {
    let img_i = 0

    intervalID = setInterval(()=> {
      botImg.src = "../assets/" + imgs[img_i];
      img_i = (img_i + 1) % imgs.length
    }, 1000)
  }

  //fidgetyAnimation(['noTalkPositive1.jpg', 'noTalkPositive2.jpg'])


  recordButton.addEventListener("click", () => {        
      recordButton.blur();

      if ( recordButton.classList.contains("selected-button") ) {
          // console.log("remove selected button");
          alert("Recording stopped.")
          recognition.stop();
          recordButton.classList.remove("selected-button");
      } 
      else {
          // console.log("add selected button");
          //alert("Recording now!")
          recognition.start();
          recordButton.classList.add("selected-button");
      }
  });

  sendButton.addEventListener("click", ()=> {
      sendButton.blur();
      
      if (recordButton.classList.contains("selected-button")) {
          //alert("Recording stopped.")
          recognition.stop();
          recordButton.classList.remove("selected-button");
      }
      sendMessage('porcupine.png', transcript)  //display user message
      botResponse(transcript)

      setTimeout(function() {
          const messages = document.querySelectorAll('.message');
          const lastMessage = messages[messages.length - 1];
          const spanInLastMessage = lastMessage.querySelector('span');
          botResp = spanInLastMessage.textContent;
          console.log(botResp)

          //TTS(botResp)
          animationWithTTS(botResp)
      }, 3000);

      transcript = ""
  });

  //test
  function test() {
    text1 = "Before adopting, it’s important to consider the commitment and responsibility of pet ownership"
    text2 = "The text you provided acknowledges the gravity of loss and suffering caused by war. It emphasizes the importance of recognizing the human cost and seeking peaceful resolutions"
    text3 = "What's 3 * 9?"
    text4 = "Good luck with your project!"
    getTone(text1).then(tone => {
      log(text1 + "\ntone: " + tone)
    })
  }
});