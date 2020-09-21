import express from 'express'
import http from 'http'
import createGame from './public/game.js'
import socketio from 'socket.io'

const app = express()
const server = http.createServer(app)
const socket = socketio(server)

app.use(express.static('public'))

const game = createGame()

game.subscribe((command) => {
    console.log(`Emitting ${command.type}`)
    socket.emit(command.type, command)
})

console.log(game.state)

socket.on('connection', (socket) => {
    const playerId = socket.id
    console.log(`Player connected on Server with id ${playerId}`)

    game.addPlayer({playerId: playerId})

    socket.emit('setup', game.state)

    socket.on('disconnect', () => {
        game.removePlayer({ playerId: playerId })
        console.log(`> Player disconnected ${playerId}`)
    })

})


server.listen(3000, () => {
    console.log(`> Server listen on port : 3000`)
})
