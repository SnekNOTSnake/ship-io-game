const { PLAYER_RADIUS, BULLET_RADIUS } = require('../shared/constants')

const applyCollisions = (players, bullets) => {
	return bullets.filter((bullet) => {
		for (let i = players.length - 1; i >= 0; i--) {
			if (
				bullet.parentID !== players[i].id &&
				bullet.distanceTo(players[i]) <= PLAYER_RADIUS + BULLET_RADIUS
			) {
				players[i].takeDamage()
				return true
			}
		}
		return false
	})
}

module.exports = applyCollisions
