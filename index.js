const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const request = require('request')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('port', (process.env.PORT || 3000))


const APIURL = 'https://opentdb.com/api.php?amount=1&category=18'

//function to fix &quot &l &g
const quoteFilter = function(string){
    let filtered = string.replace(/&(l|g|quo)t;/g, function(a,b){
    return {
        l   : '<',
        g   : '>',
        quo : '"'
    }[b];
})
    
    return filtered;
}

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
        "text": "Choose an answer",
        "fallback": "You are unable to choose an answer",
        "callback_id": "trivia_bot",
        "color": "#3AA3E3",
        "attachment_type": "default",
        "actions": []
      }
    ]
  }


  request.get(APIURL, (err, response, body) => {
    if (err) throw err

    const APIData = JSON.parse(body)

    // set bot text
    data.text = quoteFilter(APIData.results[0].question);

    // add incorrect answers to response data
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

    // calculate random index for attachments
    const random = () => {
      return Math.floor(Math.random() * data.attachments[0].actions.length)
    }

    const corretAnswer = {
      "name": "answer",
      "text": APIData.results[0].correct_answer,
      "type": "button",
      "value": "correct"
    }

    // randomly insert correct answer to response data
    data.attachments[0].actions.splice(random(), 0, corretAnswer)

    res.send(data)
  })

})

app.post('/answer', (req, res) => {

  const json = JSON.parse(req.body.payload)

  const answer = json.actions[0].value
 
  const data = {
    "response_type": "in_channel",
    "replace_original": false,
    "text": answer
  }
 
   res.send(data)
 })

const server = app.listen(app.get('port'), () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env)
})