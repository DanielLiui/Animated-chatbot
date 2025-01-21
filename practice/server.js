

const express = require('express')
const app = express()
const http = require('http')
const logger = require("morgan")
const favicon = require("serve-favicon")
const PORT = 3000 


//Middleware
app.use(express.static(__dirname + '/public')) 
app.use(favicon(__dirname + "/public/favicon.ico"))
//app.use(logger("dev")) 
app.use(express.json())


//Routes
let users = []

app.get('/', (req, resp) => {
  resp.sendFile(__dirname + '/public/index.html')
})

app.post("/test", (req, resp)=> {
  obj = resp.body
  resp.json(obj)
})


app.listen(PORT, err => {
  if(err) {
    console.log(err)
  } else {
    console.log("Visit:")
    console.log("http://localhost:3000/")
  }
})

