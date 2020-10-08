const ObjectClass = require('./objectClass')
const Bullet = require('./bullet')
const {
	PLAYER_SPEED,
	PLAYER_MAX_HP,
	SCORE_PER_SECOND,
	ARENA_SIZE,
	FIRE_COOLDOWN,
} = require('../shared/constants')

class Player extends ObjectClass {
	constructor(id, username, x, y) {
		super(id, x, y, Math.random() * 2 * Math.PI, PLAYER_SPEED)
		this.username = username
		this.hp = PLAYER_MAX_HP
		this.score = 0
		this.fireCooldown = FIRE_COOLDOWN
	}

	// Returns a newly bullet if present
	update(time) {
		// Update the object position
		super.update(time)

		// Update score
		this.score += time * SCORE_PER_SECOND

		// Make sure player always stays in bounds
		this.x = Math.max(0, Math.min(this.x, ARENA_SIZE))
		this.y = Math.max(0, Math.min(this.y, ARENA_SIZE))

		// Fire a bullet when cooldown is done
		this.fireCooldown -= time
		if (this.fireCooldown <= 0) {
			this.fireCooldown = FIRE_COOLDOWN
			return new Bullet(this.id, this.x, this.y, this.dir)
		}

		return null
	}

	serializeForUpdate() {
		return {
			...super.serializeForUpdate(),
			hp: this.hp,
			dir: this.dir,
		}
	}
}

module.exports = Player
