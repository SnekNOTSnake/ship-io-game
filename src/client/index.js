import { connect, play } from './networking'
import { downloadAssets } from './assets'
import { startRendering, stopRendering } from './render'
import { startCapturingInput, stopCapturingInput } from './input'
import { initState } from './state'
import { setLeaderboardVisibility } from './leaderboard'

import './styles/main.css'

const playMenu = document.querySelector('.playMenu')
const input = document.querySelector('.playMenu input')
const playButton = document.querySelector('.playMenu button')

const onGameOver = () => {
	playMenu.classList.remove('hidden')
	input.focus()
	setLeaderboardVisibility(false)
	stopCapturingInput()
	stopRendering()
}

Promise.all([connect(onGameOver), downloadAssets()])
	.then(() => {
		playMenu.classList.remove('hidden')
		input.focus()

		// On play button click
		playButton.addEventListener('click', () => {
			playMenu.classList.add('hidden')
			setLeaderboardVisibility(true)
			play(input.value)
			initState()
			startRendering()
			startCapturingInput()
		})
	})
	.catch((err) => console.error(err))
