import express from 'express'
import bodyparser from 'body-parser'

const app = express()
import request from 'http'

const port = 3000

// crypto
import { scrypt, randomBytes, timingSafeEqual, scryptSync } from "crypto";

app.use(bodyparser.json())
app.use(
  bodyparser.urlencoded({
    extended: true,
  })
)


/*
  user authentication
*/
var users = new Map()

class User {
  constructor(email, password, salt, hashedPassword) {
    this.email = email
    this.password = password
    this.salt = salt
    this.hashedPassword = hashedPassword
  }
}

app.get('/users', (request, response) => {
  response.status(200).json(JSON.stringify(Object.fromEntries(users)))
})

app.get('/users/:id', (request, response) => {
  const id = request.params.id
  if (users.get(id)) {
    console.log("got user with id")
    response.status(200).json(JSON.stringify(users.get(id)))
  }

  throw Error ('No user stored with id')
})

app.post('/users', (request, response) => {
  const email = request.body.email
  if (!email) {
    throw Error ('No email field provided')
  }

  const password = request.body.password
  if (!password) {
    throw Error ('No password field provided')
  }

  // generate random user id not already in map
  const userId = randomBytes(16).toString()
  while (users.get(userId)) {
    userId = randomBytes(16).toString()
  }

  // generate hashed password
  const salt = randomBytes(16).toString("hex");
  const hashedPassword = scryptSync(password, salt, 64)

  const user = new User(email, password, salt, hashedPassword)

  users.set(userId, user)
  console.log(users)
  response.status(200).json(JSON.stringify(Object.fromEntries(users)))
})

/*
  Cannot PUT of existing user
  Because requires re-hashing password
*/
// app.put('/users/:id', (request, response) => {
//   const id = request.params.id

//   const email = request.body.email
//   if (!email) {
//     throw Error ('No email field provided')
//   }

//   const password = request.body.password
//   if (!password) {
//     throw Error ('No password field provided')
//   }

//   const user = new User(email, password)
//   users.set(id, user)
//   response.status(200).json(JSON.stringify(Object.fromEntries(users)))
// })

app.delete('/users/:id', (request, response) => {
  const id = request.params.id

  if (!users.get(id)) {
    throw Error ('No such key id in map')
  }

  users.delete(id)
  response.status(200).json(JSON.stringify(Object.fromEntries(users)))
})

app.get('/login', (request, response) => {
  const email = request.body.email
  if (!email) {
    throw Error ('No email field provided')
  }

  const password = request.body.password
  if (!password) {
    throw Error ('No password field provided')
  }

  // get the stored password
  for (const [key, value] of users) {
    console.log(`The value for key ${key} is ${value}`)
    // email match - compare passwords w/ crypto
    if (value.email == email) {
      // get stored password
      const storedPasswordBuf = Buffer.from(value.hashedPassword, "hex")
      // hash this password with existing salt
      const suppliedPasswordBuf = Buffer.from(scryptSync(password, value.salt, 64))
      // match passwords
      if (timingSafeEqual(storedPasswordBuf, suppliedPasswordBuf)) {
        response.status(200).json(JSON.stringify("Successful Login!"))
      } else {
        throw Error ('Could not match passwords')
      }
    }
  }

  throw Error ('Could not find user with provided email')
})

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})