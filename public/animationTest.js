
//+
document.addEventListener("DOMContentLoaded", () => {
  let botImg = document.querySelector("#bot-img")
  let animateButton = document.querySelector("#animate-button")
  let stopButton = document.querySelector("#stop-button")
  let intervalId

  function startAnimation() {
    let imgs = ["K smile.png", "K grin.png", "K laugh 2.png"]
    let img_i = 0
  
    intervalID = setInterval(()=> {
      botImg.src = "../assets/" + imgs[img_i];
      img_i = (img_i + 1) % imgs.length
    }, 1000)
  
  }

  function stopAnimation() {
    clearInterval(intervalID);
  }

  //ev handlers
  animateButton.addEventListener('click', (ev)=> {
    startAnimation()
  })

  stopButton.addEventListener('click', (ev)=> {
    stopAnimation()
  })
  
})
