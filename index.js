const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const facts = require('./facts')
const app = express()

const randomFact = () => {
  let randomFactId = Math.floor((Math.random() * facts.length))
  return facts[randomFactId]
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('port', (process.env.PORT || 3000))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

// response
app.post('/', (req, res) => {
  // const text = req.body.text
  const getFact = randomFact();
    let Fact = getFact.fact;
    const data = {
    response_type: 'in_channel',
    text: Fact
  }

  res.send(data)
})

const server = app.listen(app.get('port'), () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env)
})
