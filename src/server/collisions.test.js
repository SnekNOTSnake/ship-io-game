const Player = require('./player')
const Bullet = require('./bullet')
const applyCollisions = require('./collisions')
const { BULLET_RADIUS, PLAYER_RADIUS } = require('../shared/constants')

describe('Collision', () => {
	describe('Apply collisions', () => {
		it('Should not collide with its creator', () => {
			const playerID = 'player-test-1'
			const player1 = new Player(playerID, 'someone', 1, 1)
			const bullet1 = new Bullet(playerID, 1, 1, 0)

			expect(applyCollisions([player1], [bullet1])).toHaveLength(0)
		})

		it('Should deal damage when colliding with other players', () => {
			const bullet1 = new Bullet('player-test-1', 1, 1, 0)
			const player2 = new Player(
				'player-test-2',
				'someone',
				1 + BULLET_RADIUS + PLAYER_RADIUS,
				1,
			)

			// Make Jest spy on player2 takeDamage method
			jest.spyOn(player2, 'takeDamage')

			const hitBullets = applyCollisions([player2], [bullet1])
			expect(hitBullets).toHaveLength(1)
			expect(hitBullets).toContain(bullet1)
			expect(player2.takeDamage).toBeCalledTimes(1)
		})
	})
})
