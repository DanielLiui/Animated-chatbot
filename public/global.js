
const serverPort = 'http://127.0.0.1:7000'  //flask port
let userMessages = []
let botMessages = []
let message = ''
let projPath = ''
let userID = ''  //function to make is in textChatClient.js


//function returns unique user ID
function makeUUID() {  
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
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
    botMessages.push(ret.reply);
    return ret.reply

  } catch (error) {
    console.error('There was a problem with the fetch operation: ' + error.message);
  }
}




