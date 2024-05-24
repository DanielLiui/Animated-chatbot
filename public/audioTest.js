
// script.js
let recordButton = document.getElementById('record-button');
let botSpeakButton = document.getElementById('bot-speak-button')
let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

let isRecording = false;
let transcript = '';


//ev listeners
recordButton.addEventListener('click', function() {
    if (isRecording) {
        recognition.stop();
        recordButton.style.backgroundColor = ''; // Change to original color
    } else {
        recognition.start();
        recordButton.style.backgroundColor = 'red'; // Change to recording color
    }
    isRecording = !isRecording;
});

recognition.onresult = function(event) {
    transcript += event.results[0][0].transcript;
    console.log(transcript);
};

recognition.onend = function() {
  if (isRecording) {
      recognition.start();
  }
};


botSpeakButton.addEventListener('click', ()=> {
  //let utterance = new SpeechSynthesisUtterance('Hello, this is your AI assistant');
  window.speechSynthesis.speak(utterance);

})

