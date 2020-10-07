import { debounce } from 'throttle-debounce'
import { getCurrentState } from './state'
import { getAsset } from './assets'
import { ARENA_SIZE, PLAYER_RADIUS } from 'Constants'

const setCanvasDimension = () => {
	// On small screens (e.g. phones), we want to "zoom out"
	// So players can still see at least 800 in-game units of width
	const scaleRatio = Math.max(1, 800 / window.innerWidth)
	canvas.width = scaleRatio * window.innerWidth
	canvas.height = scaleRatio * window.innerHeight
}

// The canvas element
const canvas = document.querySelector('.gameCanvas')
const context = canvas.getContext('2d')
setCanvasDimension()

// On resize, recalculate the canvas dimension
window.addEventListener('resize', debounce(100, setCanvasDimension))

// Render Player
const renderPlayer = (me, player) => {
	const { x, y, dir } = player
	const canvasX = canvas.width / 2 + x - me.x
	const canvasY = canvas.height / 2 + y - me.y

	// Draw ship
	context.save()
	context.translate(canvasX, canvasY)
	context.rotate(dir)
	context.drawImage(
		getAsset('ship.svg'),
		-PLAYER_RADIUS,
		-PLAYER_RADIUS,
		PLAYER_RADIUS * 2,
		PLAYER_RADIUS * 2,
	)
	context.restore()

	// Draw Healthbar
	context.fillStyle = '#fff'
	context.fillRect(
		canvasX - PLAYER_RADIUS,
		canvasY - PLAYER_RADIUS - 20,
		PLAYER_RADIUS * 2,
		2,
	)
	context.fillStyle = '#ff0000'
	context.fillRect(
		canvasX - PLAYER_RADIUS + PLAYER_RADIUS * 2 * player.hp,
		canvasY - PLAYER_RADIUS - 20,
		PLAYER_RADIUS * 2,
		2,
	)
}

// Render root
const render = () => {
	const { me, others } = getCurrentState()
	if (!me) return

	// Draw Background
	context.fillStyle = '#222'
	context.fillRect(0, 0, canvas.width, canvas.height)

	// Draw Boundaries
	context.strokeStyle = '#fff'
	context.lineWidth = 2
	context.strokeRect(
		canvas.width / 2 - me.x,
		canvas.height / 2 - me.y,
		ARENA_SIZE,
		ARENA_SIZE,
	)

	// Draw all Players
	renderPlayer(me, me)
	others.forEach((player) => renderPlayer(me, player))
}

let renderInterval = null

export const startRendering = () => {
	clearInterval(renderInterval)
	console.log('start rendering')
	renderInterval = setInterval(render, 1000 / 60)
}
