const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const facts = require('./facts')
const request = require('request')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('port', (process.env.PORT || 3000))

const getApiData = (req, res) => {
  request.get('https://opentdb.com/api.php?amount=1&category=18', (err, response, body) => {
    if (!err && response.statusCode == 200) {
      res.send(JSON.parse(body))
    }
  })
}

const randomFact = () => {
  let randomFactId = Math.floor((Math.random() * facts.length))
  return facts[randomFactId]
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

// response
app.post('/', (req, res) => {

  const text = req.body.text

  if(text === 'trivia') {
    getApiData(req, res)
  } else {  
    const getFact = randomFact()
    const fact = getFact.fact

    const data = {
      "response_type": "in_channel",
      "text": fact,
      "attachments": [
          {
              "text": "Choose a game to play",
              "fallback": "You are unable to choose a game",
              "callback_id": "wopr_game",
              "color": "#3AA3E3",
              "attachment_type": "default",
              "actions": [
                  {
                      "name": "game",
                      "text": "Chess",
                      "type": "button",
                      "value": "chess"
                  },
                  {
                      "name": "game",
                      "text": "Falken's Maze",
                      "type": "button",
                      "value": "maze"
                  },
                  {
                      "name": "game",
                      "text": "Thermonuclear War",
                      "style": "danger",
                      "type": "button",
                      "value": "war",
                      "confirm": {
                          "title": "Are you sure?",
                          "text": "Wouldn't you prefer a good game of chess?",
                          "ok_text": "Yes",
                          "dismiss_text": "No"
                      }
                  }
              ]
          }
      ]
    }

    res.send(data)
  }
})

const server = app.listen(app.get('port'), () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env)
})
