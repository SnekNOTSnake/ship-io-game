import { connect, play } from './networking'
import { downloadAssets } from './assets'
import { startRendering, stopRendering } from './render'
import { startCapturingInput, stopCapturingInput } from './input'
import { initState } from './state'
import { setLeaderboardVisibility } from './leaderboard'

import './styles/main.css'

const playMenu = document.querySelector('.playMenu')
const input = document.querySelector('.playMenu input')
const form = document.querySelector('.playMenu form')
const h2 = form.querySelector('h2')

const onGameOver = () => {
	playMenu.classList.remove('hidden')
	input.focus()
	setLeaderboardVisibility(false)
	stopCapturingInput()
	stopRendering()
	h2.innerText = 'Game Over'
}

Promise.all([connect(onGameOver), downloadAssets()])
	.then(() => {
		playMenu.classList.remove('hidden')
		input.focus()

		// On play button click
		form.addEventListener('submit', (e) => {
			e.preventDefault()
			playMenu.classList.add('hidden')
			setLeaderboardVisibility(true)
			play(input.value)
			initState()
			startRendering()
			startCapturingInput()
		})
	})
	.catch((err) => console.error(err))
