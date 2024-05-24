let sendButton = document.querySelector(".send-button")
let inputField = document.querySelector(".input-field")
let messageArea = document.querySelector(".message-area")
serverPort = 'http://127.0.0.1:8000'


//functions (event listeners below)
function sendMessage(profileImg, message) {
  let messageDiv = document.createElement('div')
  messageDiv.className = 'message'

  let img = document.createElement('img')
  img.src = '../assets/' + profileImg
  messageDiv.appendChild(img)

  let messageSpan = document.createElement('span');
  messageSpan.className = 'message-text'
  messageSpan.textContent = message
  messageDiv.appendChild(messageSpan)
  messageArea.appendChild(messageDiv)
}


function botResponse(message) {
  let reqData = {message: message} 
  xr = new XMLHttpRequest()
  xr.open("POST", serverPort + "/getResponse")  //+
  xr.setRequestHeader("Content-Type", "application/json")
  xr.send(JSON.stringify(reqData))

  xr.onreadystatechange = () => {
    if (xr.readyState == 4 && xr.status == 200) {
      ret = JSON.parse(xr.responseText)
      console.log("Resp from server: " + ret)
      sendMessage("K-VRC.png", ret.response)
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  function messageExchange() {
    message = inputField.value.trim()

    if (message !== '') {
      inputField.value = ''
      sendMessage('porcupine.png', message)  //display user message
      botResponse(message)
    }
  }
 
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
})


  