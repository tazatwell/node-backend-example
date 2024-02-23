const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const port = 3000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/weathers', db.getWeathers)
app.get('/weathers/:id', db.getWeatherById)
app.post('/weathers', db.createWeather)
app.put('/weathers/:id', db.updateWeather)
app.delete('/weathers/:id', db.deleteWeather)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})