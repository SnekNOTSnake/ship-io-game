const Game = require('./game')
const { MSG_TYPES } = require('Constants')

jest.useFakeTimers()

describe('Game', () => {
	it('Should update the game on interval', () => {
		const game1 = new Game()
		setInterval(() => game1.update(), 1000 / 60)

		// Force the game to have been created in the past
		game1.lastUpdatedTime = Date.now() - 10
		const createdTime = game1.lastUpdatedTime

		// Run the function bound to interval, updating the game
		jest.runOnlyPendingTimers()
		expect(createdTime).not.toEqual(game1.lastUpdatedTime)
	})

	it('Should send updates on every other/second update', () => {
		const game1 = new Game()
		setInterval(() => game1.update(), 1000 / 60)
		const socket = {
			id: '512',
			emit: jest.fn(),
		}
		game1.addPlayer(socket, 'someone')

		// First update
		jest.runOnlyPendingTimers()
		expect(socket.emit).toHaveBeenCalledTimes(0)
		expect(game1.shouldSendUpdate).toBe(true)

		// Second update, send the update
		jest.runOnlyPendingTimers()
		expect(socket.emit).toHaveBeenCalledTimes(1)
		expect(game1.shouldSendUpdate).toBe(false)
		expect(socket.emit).toHaveBeenLastCalledWith(
			MSG_TYPES.GAME_UPDATE,
			expect.objectContaining({
				time: expect.any(Number),
				me: expect.any(Object),
				others: expect.any(Array),
				leaderboard: expect.any(Array),
			}),
		)
	})

	it('Should update the direction of a player', () => {
		const game1 = new Game()
		setInterval(() => game1.update(), 1000 / 60)
		const socket = {
			id: '513',
			emit: jest.fn(),
		}
		game1.addPlayer(socket, 'something')

		game1.controlShip(socket, 2)

		// Run update twice, as updates are only sent on every second call
		jest.runOnlyPendingTimers()
		jest.runOnlyPendingTimers()

		expect(socket.emit).toHaveBeenLastCalledWith(
			MSG_TYPES.GAME_UPDATE,
			expect.objectContaining({
				me: expect.objectContaining({ dir: 2 }),
			}),
		)
	})
})
