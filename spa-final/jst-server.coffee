# Mini-serveur applicatif pour l'appli
# ====================================

bodyParser   = require('body-parser')
errorHandler = require('errorhandler')
express      = require('express')
fs           = require('fs')
http         = require('http')
logger       = require('morgan')
socketio     = require('socket.io')
low          = require('lowdb')

try
  low.load('db.json')
catch
  console.error "Cannot load db.json"
DB = low('checkins').sortBy('key').value().reverse()

exports.startServer = (port, path, callback) ->
  app = express()
  server = http.createServer(app)
  io = socketio(server)

  # The basics

  app.use express.static "#{__dirname}/public"
  app.use errorHandler()
  app.use logger(':method :url')
  app.use bodyParser.urlencoded({ extended: true })
  app.use bodyParser.json()

  app.get '/', (request, response) ->
    response.sendfile 'public/index.html'

  # Sync endpoints (Ajax)

  app.get '/checkins', (request, response) ->
    response.json DB[0...10]

  app.post '/checkins', (request, response) ->
    checkIn = request.body
    checkIn.id = DB.length + 1
    DB.unshift checkIn
    low('checkins').insert(checkIn);
    response.status(201).json { id: checkIn.id }
    io.emit 'checkin', checkIn

  app.get '/checkins/:id', (request, response) ->
    id = +request.params.id
    result = (ci for ci in DB when ci.id is id)
    if result[0]
      response.json result[0]
    else
      response.status(404).json {}

  server.listen port, ->
    console.log "Listening on port #{port}… WebSockets enabled."
    callback()
