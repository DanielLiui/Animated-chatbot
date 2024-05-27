function log(s) {
  console.log(s)
}

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
        if ('speechSynthesis' in window) {
            let utterance = new SpeechSynthesisUtterance(text)
            utterance.pitch = 1
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
    }

    /*
    function getTone(text) {
      return new Promise((resolve, reject) => {
        let reqData = {text: text}
        let xr = new XMLHttpRequest()
        xr.open("POST", serverPort + "/getTone")
        xr.setRequestHeader("Content-Type", "application/json")
        xr.send(JSON.stringify(reqData))

        xr.onreadystatechange = () => {
          if (xr.readyState == 4 && xr.status == 200) {
            let toneObj = JSON.parse(xr.responseText)
            log("Resp from server: " + toneObj)

            if (toneObj.tone == 'positive' && text[text.length - 1] == '!') {
              return 'excited'
            }
            else if (toneObj.tone == 'negative') {
              return 'serious'
            }
            else {
              return toneObj.tone
            }
          } else {
            reject(new Error('Request failed with status ' + xr.status))
          }
        }
      })
    }

    function animationWithTTS(text) {
      let sentences = text.split('. ')
      let tone = ''
      let utterance = new SpeechSynthesisUtterance(text);

      for (sentence in sentences) {
        tone = getTone(sentence)  //if sentence ends with '!', tone = excited
        let botExpressionFilename = getExpressionImg(tone) 
        TTS(utterance, sentence)
        botImg.src = '../assets/animationImages/' + botExpressionFilename
      }

      utterance.onend = function(ev) {
        botImg.src = '../assets/animationImages/'

        if (tone == 'positive' || tone == 'neutral') {
          botImg.src += 'positiveNoTalk.jpg'
        }
        else if (tone == 'excited') { 
          botImg.src += 'excitedNoTalk.jpg'
        }
        else {  //serious
          botImg.src += 'seriousNoTalk.jpg'
        }
      }
        
    }
    */


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
            alert("Recording now!")
            recognition.start();
            recordButton.classList.add("selected-button");
        }
    });

    sendButton.addEventListener("click", ()=> {
        sendButton.blur();
        
        if (recordButton.classList.contains("selected-button")) {
            alert("Recording stopped.")
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
            animation&TTS(botResp)
        }, 3000);

        transcript = ""
    });
});