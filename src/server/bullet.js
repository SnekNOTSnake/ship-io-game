const { v4: uuidv4 } = require('uuid')
const ObjectClass = require('./objectClass')
const { BULLET_SPEED, ARENA_SIZE } = require('../shared/constants')

class Bullet extends ObjectClass {
	constructor(parentID, x, y, dir) {
		super(uuidv4(), x, y, dir, BULLET_SPEED)
		this.parentID = parentID
	}

	// Return true, if the bullet should be destroyed because of leaving arena
	update(time) {
		super.update(time)
		return (
			this.x < 0 || this.x > ARENA_SIZE || this.y < 0 || this.y > ARENA_SIZE
		)
	}
}

module.exports = Bullet
