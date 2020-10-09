import io from 'socket.io-client'
import { throttle } from 'throttle-debounce'
import { MSG_TYPES } from 'Constants'
import { processGameUpdate } from './state'

const disconnectModal = document.querySelector('.disconnectModal')
const reloadButton = document.querySelector('.disconnectModal button')

reloadButton.addEventListener('click', () => window.location.reload())

const socketProtocol = window.location.protocol.includes('https') ? 'wss' : 'ws'
const socket = io(`${socketProtocol}://${window.location.host}`, {
	reconnection: false,
})
const connectedPromise = new Promise((resolve, reject) => {
	socket.on('connect', () => {
		console.log('Connected to server')
		resolve()
	})
})

export const connect = (onGameOver) => {
	connectedPromise.then(() => {
		socket.on(MSG_TYPES.GAME_UPDATE, processGameUpdate)
		socket.on(MSG_TYPES.GAME_OVER, onGameOver)
		socket.on('disconnect', () => {
			console.log('Disconnected from server')
			disconnectModal.classList.remove('hidden')
		})
	})
}

export const play = (username) => {
	socket.emit(MSG_TYPES.JOIN_GAME, username)
}

export const updateDirection = throttle(25, (dir) => {
	socket.emit(MSG_TYPES.INPUT, dir)
})
