const { ARENA_SIZE, MSG_TYPES } = require('../shared/constants')
const applyCollisions = require('./collisions')
const Player = require('./player')

class Game {
	constructor() {
		this.sockets = {}
		this.players = {}
		this.bullets = []
		this.lastUpdatedTime = Date.now()
		this.shouldSendUpdate = false
	}

	addPlayer(socket, username) {
		// Random centralized position
		const randomX = (Math.random() * 0.5 + 0.25) * ARENA_SIZE
		const randomY = (Math.random() * 0.5 + 0.25) * ARENA_SIZE

		this.sockets[socket.id] = socket
		this.players[socket.id] = new Player(socket.id, username, randomX, randomY)
	}

	controlShip(socket, dir) {
		this.players[socket.id].setDirection(dir)
	}

	removePlayer(socket) {
		delete this.sockets[socket.id]
		delete this.players[socket.id]
	}

	update() {
		const now = Date.now()
		const time = (now - this.lastUpdatedTime) / 1000
		this.lastUpdatedTime = now

		// Update each and every bullets
		// this section is talking about destroying bullet on leaving arena
		const bulletsToBeDestroyed = []
		this.bullets.forEach((bullet) => {
			if (bullet.update(time)) bulletsToBeDestroyed.push(bullet)
		})
		this.bullets = this.bullets.filter(
			(bullet) => !bulletsToBeDestroyed.includes(bullet),
		)

		// Update each and every players
		Object.keys(this.players).forEach((objectId) => {
			const newBullet = this.players[objectId].update(time)
			if (newBullet) this.bullets.push(newBullet)
		})

		// Apply collision
		// Destroy bullet on player hit, give the parent player score for hitting
		const hitBullets = applyCollisions(
			Object.values(this.players),
			this.bullets,
		)
		hitBullets.forEach((bullet) => this.players[bullet.parentID].onHitEnemy())
		this.bullets = this.bullets.filter((bullet) => !hitBullets.includes(bullet))

		// Check if any player is dead
		Object.values(this.players).forEach((pl) => {
			const player = this.players[pl.id]
			const socket = this.sockets[pl.id]
			if (player.hp <= 0) {
				socket.emit(MSG_TYPES.GAME_OVER)
				this.removePlayer(socket)
			}
		})

		// Send the update to every players, half often
		if (this.shouldSendUpdate) {
			const leaderboard = this.getLeaderboard()
			Object.keys(this.sockets).forEach((objectId) => {
				const player = this.players[objectId]
				this.sockets[objectId].emit(
					MSG_TYPES.GAME_UPDATE,
					this.createUpdate(player, leaderboard),
				)
			})
			this.shouldSendUpdate = false
		} else {
			this.shouldSendUpdate = true
		}
	}

	getLeaderboard() {
		const ordered = Object.values(this.players)
			.sort((a, b) => b.score - a.score)
			.slice(0, 5)
			.map((pl) => ({ username: pl.username, score: Math.round(pl.score) }))

		return ordered
	}

	createUpdate(player, leaderboard) {
		// Update only the nearby players and bullets to save data
		const nearbyPlayers = Object.values(this.players).filter((pl) => {
			return pl !== player && player.distanceTo(pl) < ARENA_SIZE / 2
		})
		const nearbyBullets = this.bullets.filter((bullet) => {
			return bullet.distanceTo(player) < ARENA_SIZE / 2
		})

		return {
			time: this.lastUpdatedTime,
			// { id, x, y, hp, dir }
			me: player.serializeForUpdate(),
			others: nearbyPlayers.map((pl) => pl.serializeForUpdate()),
			bullets: nearbyBullets.map((bullet) => bullet.serializeForUpdate()),
			leaderboard,
		}
	}
}

module.exports = Game
