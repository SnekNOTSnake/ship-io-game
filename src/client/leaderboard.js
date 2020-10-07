import escape from 'lodash.escape'

const leaderboard = document.querySelector('.leaderboard')
const leaderboardTableBody = document.querySelector('.leaderboard table tbody')

export const updateLeaderboard = (rawData) => {
	// Each data contains { username, score }
	const data = Array.from(new Array(5))
	data.unshift(...rawData)

	const rows = data.slice(0, 5).map((player) => {
		return `<tr>
			<td>${escape(player?.username).slice(0, 20) || '- - - - -'}</td>
			<td>${player?.score || '- - - - -'}</td>
		</tr>`
	})

	leaderboardTableBody.innerHTML = rows.join('')
}

export const setLeaderboardVisibility = (visible) => {
	if (visible) leaderboard.classList.remove('hidden')
	else leaderboard.classList.add('hidden')
}
