const Bullet = require('./bullet')
const { BULLET_SPEED } = require('../shared/constants')

const DIRECTION_UP = 0
const DIRECTION_DOWN = Math.PI

describe('Bullet', () => {
	describe('Update', () => {
		it('Should move at bullet speed', () => {
			const x = 1
			const y = 1
			const bullet1 = new Bullet('test-bullet-1', x, y, DIRECTION_DOWN)

			bullet1.update(1)
			expect(bullet1).toEqual(expect.objectContaining({ y: y + BULLET_SPEED }))
		})

		it('Should be destroyed when leaving arena', () => {
			const x = 1
			const y = 1
			const bullet1 = new Bullet('test-bullet-2', x, y, DIRECTION_UP)

			expect(bullet1.update(1)).toBe(true)
		})

		it('Should not be destroyed while not leaving arena', () => {
			const x = 1
			const y = 1
			const bullet1 = new Bullet('test-bullet-3', x, y, DIRECTION_DOWN)

			expect(bullet1.update(1)).toBe(false)
		})
	})
})
