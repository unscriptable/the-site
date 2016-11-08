"use strict"
import express          from 'express'
import path             from 'path'
import favicon          from 'serve-favicon'
import logger           from 'morgan'
import cookieParser     from 'cookie-parser'
import bodyParser       from 'body-parser'
import fs               from 'fs'
import { createEngine } from 'express-react-views'
import router           from './router'

// TODO: get config from a file, password from env var.

const wordpressTimeout = 5000 // msecs
const wordpressConfig = { timeout: wordpressTimeout }
const emailConfig
  = {
    service: 'gmail',
    user: 'hello@iotopia-solutions.com',
    pass: 'uSyiKT;d49=:rXb.'
  }
const config
  = {
    wordpress: wordpressConfig,
    email: emailConfig
  }

const app = express()

app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'jsx')
app.engine('jsx', createEngine())

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../assets')))

app.use('/', router(config))

// using arrow syntax
app.use((req, res, next) => {
  let err = new Error('Not Found: ' + req.url)
  err.status = 404
  next(err)
})

if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    console.log(err, err.stack)
    res.status(err.status || 500)
    res.send(err.message + '\n' + JSON.stringify(err.stack))
  })
}

app.use((err, req, res, next) => {
  console.log(err, err.stack)
  res.status(err.status || 500)
  res.send(err.message)
})

const server_port = process.env.PORT || 5001
const server_host = '0.0.0.0'

app.set('port', server_port)
app.set('host', server_host)

const server = app.listen(
  app.get('port'),
  app.get('host'),
  () => console.log('Express is listening on port ' + server.address().port)
)

export default app
