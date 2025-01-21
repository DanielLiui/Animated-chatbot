

document.addEventListener("DOMContentLoaded", () => {
  const btn = qSel('.btn')

  btn.addEventListener('click', (ev) => {  
    log("Button toggled")
    btn.style.backgroundColor = "grey"
  })
})