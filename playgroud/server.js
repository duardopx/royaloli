import express from 'express'
import http from 'http'
import createGame from './public/game.js'
import socketio from 'socket.io'

const app = express()
const server = http.createServer(app)
const socket = socketio(server)

app.use(express.static('public'))

const game = createGame()


console.log(game.state)

socket.on('connection', (socket) => {
    const playerId = socket.id
    console.log(`Player connected on Server with id ${playerId}`)

    socket.emit('setup', game.state)
})

server.listen(3000, () => {
    console.log(`> Server listen on port : 3000`)
})
