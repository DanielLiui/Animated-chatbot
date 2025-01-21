/*
server.js:
- Server for rendering webpages and handling requests 
- NLP requests are handled by app.py

*/
const express = require('express')
const app = express()
const http = require('http')
const logger = require("morgan")
const favicon = require("serve-favicon")
const PORT = 3000

//Middleware
app.use(express.static(__dirname + '/public')) 
app.use(favicon(__dirname + "/public/logo.ico"))
//app.use(logger("dev")) 
app.use(express.json())
app.use('/assets', express.static(__dirname + '/assets'))


//Routes
app.get('/', (req, resp) => {
  resp.sendFile(__dirname + "/public/textChat.html")
})

app.get('/textChat', (req, resp) => {
  resp.sendFile(__dirname + "/public/textChat.html")
})

app.get('/audioChat', (req, resp) => {
  resp.sendFile(__dirname + "/public/audioChat.html")
})

app.get('/getProjPath', (req, resp) => {
  resp.send({path: __dirname})
})


app.listen(PORT, () => {
  console.log("Visit http://localhost:3000/")
})
