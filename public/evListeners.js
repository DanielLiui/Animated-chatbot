

document.addEventListener("DOMContentLoaded", () => {
  let sendButton = document.querySelector(".send-button")
  let inputField = document.querySelector(".input-field")
  let messageArea = document.querySelector(".message-area")

  function sendMessage() {
    let message = inputField.value.trim()
    console.log("Message: " + message)
  
    if (message !== '') {
      inputField.value = ''
      let messageDiv = document.createElement('div')
      messageDiv.className = 'message'
  
      let img = document.createElement('img')
      img.src = '../assets/porcupine.png'
      messageDiv.appendChild(img)
  
      let messageSpan = document.createElement('span');
      messageSpan.className = 'message-text'
      messageSpan.textContent = message
      messageDiv.appendChild(messageSpan)
  
      messageArea.appendChild(messageDiv)
    }
  }

  /*
  const emotionImgs = {
    
  }

  function getResponse() {
    //get AI response & list of emotions
    //display bot img matching emotion
    /if no img matches emotion, display img matching overall sentiment (positive/neutral/neg)
    let message = inputField.value.trim()

    if (message !== '') {
      let reqData = {message: message} 
      xr = new XMLHttpRequest()
      xr.open("POST", "/getReponse")
      xr.setRequestHeader("Content-Type", "application/json")
      xr.send(JSON.stringify(reqData))

      xr.onreadystatechange = () => {
        if (xr.readyState == 4 && xr.status == 200) {
          ret = JSON.parse(xr.responseText)
          console.log("Resp from server: " + ret)


        }
      }
    }

  }

  */


` `
  sendButton.addEventListener("click", (ev)=> {
    ev.preventDefault()
    sendMessage()
  });

  inputField.addEventListener('keydown', (ev)=> {
    if (ev.key === 'Enter') {
      ev.preventDefault()
      sendMessage()
      getResponse()
    }
  });
});


  