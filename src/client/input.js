import { updateDirection } from './networking'

const onMouseInput = function (e) {
	handleInput(e.clientX, e.clientY)
}

const onTouchInput = function (e) {
	const touch = e.touches[0]
	handleInput(touch.clientX, touch.clientY)
}

const handleInput = (x, y) => {
	const dir = Math.atan2(x - window.innerWidth / 2, window.innerHeight / 2 - y)
	updateDirection(dir)
}

export const startCapturingInput = () => {
	window.addEventListener('mousemove', onMouseInput)
	window.addEventListener('click', onMouseInput)
	window.addEventListener('touchstart', onTouchInput)
	window.addEventListener('touchmove', onTouchInput)
}

export const stopCapturingInput = () => {
	window.removeEventListener('mousemove', onMouseInput)
	window.removeEventListener('click', onMouseInput)
	window.removeEventListener('touchstart', onTouchInput)
	window.removeEventListener('touchmove', onTouchInput)
}
