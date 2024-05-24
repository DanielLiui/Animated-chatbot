document.addEventListener("DOMContentLoaded", () => {
    const recordButton = document.getElementById('microphone-button');
    const sendButton = document.querySelector("#audio-send-button");

    let botResponseText = "";
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
            let utterance = new SpeechSynthesisUtterance(text);
            utterance.pitch = 1;
            utterance.rate = 1;
            utterance.volume = 1;
            utterance.lang = 'en-US';

            utterance.onstart = function(event) {
                console.log('Speech has started.');
            };

            utterance.onend = function(event) {
                console.log('Speech has ended.');
            };

            utterance.onerror = function(event) {
                console.error('SpeechSynthesisUtterance.onerror');
            };

            window.speechSynthesis.speak(utterance);
        } 
        else {
            alert('Web Speech API is not supported in this browser.');
        }
    }

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

    sendButton.addEventListener("click", function() {
        sendButton.blur();
        
        if( recordButton.classList.contains("selected-button") ) {
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
            botResponseText = spanInLastMessage.textContent;
            console.log(botResponseText)

            TTS(botResponseText)
        }, 3000);

        transcript = ""
    });
});