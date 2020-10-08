process.on('uncaughtException', (err) => {
	console.error('Error: ', err)
	process.exit()
})

const express = require('express')
const socketio = require('socket.io')
const { MSG_TYPES } = require('../shared/constants')
const Game = require('./game')
const developmentConfig = require('../../webpack.development')

const app = express()
app.use(express.static('public'))

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('dist'))
} else {
	const webpack = require('webpack')
	const webpackDevMiddleware = require('webpack-dev-middleware')
	const compiler = webpack(developmentConfig)
	app.use(webpackDevMiddleware(compiler))
}

const PORT = process.env.PORT || 4200
const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

// Game setup
const game1 = new Game()
setInterval(() => game1.update(), 1000 / 60)

function joinGame(username) {
	// `this` is the socket, bound by SocketIO
	// The `username` is also passed down by SocketIO from client
	game1.addPlayer(this, username)
}

function leaveGame() {
	game1.removePlayer(this)
}

function input(dir) {
	game1.controlShip(this, dir)
}

// SocketIO
const io = socketio(server)
io.on('connection', (socket) => {
	console.log('New player, ', socket.id)

	socket.on(MSG_TYPES.JOIN_GAME, joinGame)
	socket.on(MSG_TYPES.INPUT, input)
	socket.on('disconnect', leaveGame)
})

process.on('unhandledRejection', (err) => {
	console.error('Error: ', err)
	server.close(() => process.exit())
})
