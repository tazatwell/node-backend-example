const Pool = require('pg').Pool
const pool = new Pool({
  user: 'tazatwell',
  host: 'localhost',
  database: 'tazatwell',
  password: 'mynewpassword',
  port: 5432,
})

const tableName = "weather"

const getWeathers = (request, response) => {
  pool.query('SELECT * FROM weather', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getWeatherById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM weather WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createWeather = (request, response) => {
  const { id, city, temp_lo, temp_hi, prcp, date } = request.body

  pool.query('INSERT INTO weather (id, city, temp_lo, temp_hi, prcp, date) VALUES ($1, $2, $3, $4, $5, $6)', [id, city, temp_lo, temp_hi, prcp, date], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Weather added with ID: ${results.insertId}`)
  })
}

const updateWeather = (request, response) => {
  const id = parseInt(request.params.id)
  const { city, temp_lo, temp_hi, prcp, date } = request.body

  pool.query(
    'UPDATE weather SET city = $1, temp_lo = $2, temp_hi = $3, prcp = $4, date = $5 WHERE id = $6',
    [city, temp_lo, temp_hi, prcp, date, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Weather modified with ID: ${id}`)
    }
  )
}

const deleteWeather = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM weather WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Weather deleted with ID: ${id}`)
  })
}

module.exports = {
  getWeathers,
  getWeatherById,
  createWeather,
  updateWeather,
  deleteWeather,
}
