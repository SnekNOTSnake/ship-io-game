import { updateLeaderboard } from './leaderboard'

const RENDER_DELAY = 100

/* 
 * Game update value examples

Bullet {
	id: "9fkJ7dKjCNaN",
	x: 2146.0521793921284,
	y: 1925.5924945457677,
}

Player	{
	direction: 1.6014884401649152,
	hp: 100,
	id: "J-zZzzJnVpNh7dkZAAADNaN",
	x: 2054.146820978961,
	y: 1922.7708388050116,
}
*/

const gameUpdates = []
let gameStart = 0
let firstServerTimestamp = 0

export const initState = () => {
	gameStart = 0
	firstServerTimestamp = 0
}

// Process game update sent by server
export const processGameUpdate = (update) => {
	if (!firstServerTimestamp) {
		gameStart = Date.now()
		firstServerTimestamp = update.time
	}
	gameUpdates.push(update)

	updateLeaderboard(update.leaderboard)

	// Keep only one update before the base update
	// by deleting the old ones
	const base = getBaseUpdate()
	if (base > 0) {
		gameUpdates.splice(0, base)
	}
}

// Getting the *currentServerTime minus delay*
const getDelayedServerTime = () => {
	const offset = firstServerTimestamp - gameStart
	return Date.now() + offset - RENDER_DELAY
}

// Returns the index of the base update, that is, the first game update
// before current server time, or -1 if N/A
const getBaseUpdate = () => {
	const delayedServerTime = getDelayedServerTime()
	for (let i = gameUpdates.length - 1; i >= 0; i--) {
		if (gameUpdates[i].time <= delayedServerTime) {
			return i
		}
	}
	return -1
}

// * Interpolation Functions

const interpolateObject = (object1, object2, ratio) => {
	if (!object2) return object1

	/*
		* Edge case.

		Because `object1[key]` is not always a number (e.g. an id), (object2[key] - object1[key]) would results as `NaN`. It'll then simply add the word NaN as suffix:

		"J-zZzzJnVpNh7dkZAAAD" + (NaN) * 0.4412 === "J-zZzzJnVpNh7dkZAAADNaN"
	*/

	const interpolated = {}
	Object.keys(object1).forEach((key) => {
		if (key === 'dir') {
			interpolated[key] = interpolateDirection(
				object1[key],
				object2[key],
				ratio,
			)
		} else {
			interpolated[key] = object1[key] + (object2[key] - object1[key]) * ratio
		}
	})
	return interpolated
}

// Interpolate an array of objects
const interpolateArray = (objects1, objects2, ratio) => {
	return objects1.map((obj) =>
		interpolateObject(
			obj,
			objects2.find((e) => e.id === obj.id),
			ratio,
		),
	)
}

// Determines the best way to rotate (clockwise or counterclockwise).
// For example, when rotating from -3 radians to +3 radians, we whould
// really rotate from -3 radians to +3 - 2pi radians.
const interpolateDirection = (dir1, dir2, ratio) => {
	const absDir = Math.abs(dir2 - dir1)
	if (absDir >= Math.PI) {
		// The angle between the direction is large, rotate to the other way
		if (dir1 > dir2) {
			return dir1 + (dir2 + 2 * Math.PI - dir1) * ratio
		} else {
			return dir1 - (dir2 - 2 * Math.PI - dir1) * ratio
		}
	} else {
		// Normal interpolation
		return dir1 + (dir2 - dir1) * ratio
	}
}

// Get the current state, { me, others, bullets }
export const getCurrentState = () => {
	if (!firstServerTimestamp) return {}

	const baseUpdateIndex = getBaseUpdate()
	const delayedServerTime = getDelayedServerTime()

	// If the baseUpdate is the most recent update we have, use its state.
	// Otherwise, interpolate between its state and the state of (base + 1).
	if (baseUpdateIndex < 0 || baseUpdateIndex === gameUpdates.length - 1) {
		return gameUpdates[gameUpdates.length - 1]
	} else {
		const baseUpdate = gameUpdates[baseUpdateIndex]
		const next = gameUpdates[baseUpdateIndex + 1]
		// The ratio of how much should the interpolation be made.
		// 1 means 100% to the next update, 0.75 means 75% to the next update
		const ratio =
			delayedServerTime / baseUpdate.time - next.time / baseUpdate.time
		return {
			me: interpolateObject(baseUpdate.me, next.me, ratio),
			others: interpolateArray(baseUpdate.others, next.others, ratio),
			bullets: interpolateArray(baseUpdate.bullets, next.bullets, ratio),
		}
	}
}
