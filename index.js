const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const request = require('request')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('port', (process.env.PORT || 3000))

const APIURL = 'https://opentdb.com/api.php?amount=1&category=18'

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

// response
app.post('/', (req, res) => {

  let data = {
    "response_type": "in_channel",
    "text": "Data Text",
    "attachments": [
      {
        "text": "Choose and answer",
        "fallback": "You are unable to choose an answer",
        "callback_id": "trivia_bot",
        "color": "#3AA3E3",
        "attachment_type": "default",
        "actions": []
      }
    ]
  }

  const getApiData = (req, res) => {

    request.get(APIURL, (err, response, body) => {
      if (err) throw err

      const APIData = JSON.parse(body)

      for (let i = 0; i < APIData.results[0].incorrect_answers.length; i++){
        data.attachments[0].actions.push(
          {
            "name": "answer",
            "text": APIData.results[0].incorrect_answers[i],
            "type": "button",
            "value": "incorrect"
          }
        )
      }

      data.text = APIData.results[0].question

      res.send(data)

    })

  }

  getApiData(req, res)

})

const server = app.listen(app.get('port'), () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env)
})
