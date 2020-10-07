class ObjectClass {
	constructor(id, x, y, dir, speed) {
		this.id = id
		this.x = x
		this.y = y
		this.dir = dir
		this.speed = speed
	}

	update(time) {
		// dt = 0.016
		// 0.016 * 400 = 7.2
		this.x += time * this.speed * Math.sin(this.dir)
		this.y -= time * this.speed * Math.cos(this.dir)
	}

	setDirection(dir) {
		this.dir = dir
	}

	distanceTo(obj) {
		const distanceX = this.x - obj.x
		const distanceY = this.y - obj.y
		// Math.sqrt(-300 * -300 + -400 * -400)
		return Math.sqrt(distanceX * distanceX + distanceY * distanceY)
	}

	serializeForUpdate() {
		return {
			id: this.id,
			x: this.x,
			y: this.y,
		}
	}
}

module.exports = ObjectClass
