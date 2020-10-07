const Player = require('./player')
const { PLAYER_MAX_HP, ARENA_SIZE } = require('Constants')

describe('Player', () => {
	describe('Update', () => {
		it('Should gain score each second', () => {
			const player1 = new Player('512', 'someone', 1, 1)
			const initialScore = player1.score
			player1.update(1)
			expect(player1.score).toBeGreaterThan(initialScore)
		})

		it('Should always be inside the arena', () => {
			const player1 = new Player('513', 'somewhere', 1, 1)

			// Force the player to be outside 3000px arena
			player1.x = 6000
			player1.y = 9000

			player1.update(1)
			expect(player1.x).toBeLessThanOrEqual(ARENA_SIZE)
			expect(player1.y).toBeLessThanOrEqual(ARENA_SIZE)
		})
	})

	describe('Serialize', () => {
		it('Should include HP and direction in serialization', () => {
			const player1 = new Player('513', 'something', 1, 1)
			expect(player1.serializeForUpdate()).toEqual(
				expect.objectContaining({
					hp: PLAYER_MAX_HP,
					dir: expect.any(Number),
				}),
			)
		})
	})
})
