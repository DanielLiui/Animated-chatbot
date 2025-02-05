
const serverPort = 'https://animated-chatbot-ai-api.onrender.com'  
//if working locally: http://127.0.0.1:7000
//else for deployment: https://animated-chatbot-ai-api.onrender.com

//retrieve variables from local storage. If don't exist, set to val on right side of ||
let userMessages = JSON.parse(localStorage.getItem('userMessages')) || []
let botMessages = JSON.parse(localStorage.getItem('botMessages')) || []
let message = localStorage.getItem('currentMessage') || ''
let userID = localStorage.getItem('userID') || ''


//function returns unique user ID
function makeUUID() {  
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

function log(s) { console.log(s) }

function qSel(elemType) { return document.querySelector(elemType) }


function toggleChatButtons(button){
  // Remove "selected-button" class from all buttons
  var buttons = document.querySelectorAll('.btn');
  buttons.forEach(function(btn) {
      btn.classList.remove('selected-button');
  });

  // Add "selected-button" class to the clicked button
  button.classList.add('selected-button');
  button.blur();
}


function openAudioChat(button) {
  toggleChatButtons(button)
  let inputField = qSel(".input-field")
  message = inputField.value.trim();
  saveAll()
  window.location.href = '/audioChat'
}


function openTextChat(button) {
  toggleChatButtons(button)
  saveAll()
  window.location.href = '/textChat'
}

function newChat(button) {
  toggleChatButtons(button)
  localStorage.removeItem('userMessages')
  localStorage.removeItem('botMessages')
  localStorage.removeItem('currentMessage')
  localStorage.removeItem('userID')
  window.location.reload()  //nothing is saved
}

function saveAll() {
  localStorage.setItem('userMessages', JSON.stringify(userMessages))
  localStorage.setItem('botMessages', JSON.stringify(botMessages))
  localStorage.setItem('currentMessage', message);
  localStorage.setItem('userID', userID);
}

function saveUserMessage(message) {
  userMessages.push(message)
  localStorage.setItem('userMessages', JSON.stringify(userMessages))
}

function saveBotMessage(message) {
  botMessages.push(message)
  localStorage.setItem('botMessages', JSON.stringify(botMessages))
}

function saveUserID(userID) {
  localStorage.setItem('userID', userID);
}

async function botResponse(message) {
  let reqData = {message: message, userID: userID};
  
  try {
    let response = await fetch(serverPort + "/botReply", {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(reqData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    let ret = await response.json();
    //log("Resp from server: " + JSON.stringify(ret));
    saveBotMessage(ret.reply);
    return ret.reply

  } catch (error) {
    console.error('There was a problem with the fetch operation: ' + error.message);
  }
}




