

let sendButton = qSel(".send-button")
let inputField = qSel(".input-field")
let messageArea = qSel(".message-area")
let textChatButton = qSel("#text-mode-button")
let audioChatButton = qSel("#audio-mode-button")


//functions (event listeners below)
function sendMessage(profileImg, message) {
  let messageDiv = document.createElement('div')
  messageDiv.className = 'message'

  let img = document.createElement('img')
  img.src = '/assets/' + profileImg
  messageDiv.appendChild(img)

  let messageSpan = document.createElement('span');
  messageSpan.className = 'message-text'
  messageSpan.textContent = message
  messageDiv.appendChild(messageSpan)
  messageArea.appendChild(messageDiv)
}


function loadingBotReplyAnimation() {
  let messageDiv = document.createElement('div')
  messageDiv.classList.add('message', 'loading-message')

  let img = document.createElement('img')
  img.src = '/assets/botProfile.jpg'
  messageDiv.appendChild(img)

  let loadDiv = document.createElement('div'); loadDiv.id = 'text-load-div'
  loadDiv.style.display = 'block'
  let loader = document.createElement('div'); loader.className = 'text-loader'
  loadDiv.appendChild(loader)

  let messageSpan = document.createElement('span');
  messageSpan.className = 'message-text'
  messageSpan.appendChild(loadDiv)
  messageDiv.appendChild(messageSpan)
  messageArea.appendChild(messageDiv)
}


function stopLoadingBotReply() {
  let messageDiv = qSel('.loading-message')
  messageDiv.remove()
}


function botReply(message) {
  let reqData = {message: message, userID: userID} 
  xr = new XMLHttpRequest()
  xr.open("POST", serverPort + "/botReply")  
  xr.setRequestHeader("Content-Type", "application/json")
  xr.send(JSON.stringify(reqData))

  xr.onreadystatechange = () => {
    if (xr.readyState == 4 && xr.status == 200) {
      ret = JSON.parse(xr.responseText)
      botMessages.push(ret.reply)
      stopLoadingBotReply()
      sendMessage("botProfile.jpg", ret.reply)
    }
  }
}


function messageExchange() {
  let message = inputField.value.trim()
  saveUserMessage(message)
  inputField.value = ''
  sendMessage('porcupine.png', message)
  loadingBotReplyAnimation()
  botReply(message)
}


document.addEventListener("DOMContentLoaded", () => {
  if (userID == '') userID = makeUUID()

  //display existing messages (number of bot messages might be 1 less than number of user messages)
  //for loop displays all messages except last one 
  log("User: "); log(userMessages)
  log("Bot: "); log(botMessages)

  for (let i = 0; i < userMessages.length - 1; i++) {  
    sendMessage('porcupine.png', userMessages[i])
    sendMessage('botProfile.jpg', botMessages[i])
  }

  //display last user & bot messages
  if (userMessages.length != 0) sendMessage('porcupine.png', userMessages[userMessages.length - 1])
  if (botMessages.length != 0 && botMessages.length == userMessages.length) {
    sendMessage('botProfile.jpg', botMessages[botMessages.length - 1])
  }

  inputField.value = message
 
  //event listeners
  sendButton.addEventListener('click', (ev)=> {
    ev.preventDefault()
    messageExchange()
  })

  inputField.addEventListener('keydown', (ev)=> {
    if (ev.key === 'Enter') {
      ev.preventDefault()
      messageExchange()
    }
  })

  /*
  audioChatButton.addEventListener('click', (ev)=> {
    message = inputField.value.trim()
    window.location.href = '/audioChat'
  })
  */
})


  