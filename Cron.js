const cron = require('node-cron')
const { sendThenDelete } = require('./toolbox')

class Cron {

	#hours // 0-23
	#minutes // 0-59
	#game // game related to this object
	#task // cron schedule

	constructor(hours, minutes, game) {
		console.log("creating cron obj..")
		this.#hours = hours
		this.#minutes = minutes
		this.#game = game
		this.#task= new cron.schedule(`${this.#minutes} ${this.#hours} * * *`, () => {
			console.log("It is time for me to ping..")
			game.cronSchedule()
		}, {
			timezone : "Europe/Paris"
			}
		)
		console.log("cron obj is running..")
	}

	deleteRelatedGame() {
		console.log("5 minutes before deleting game")
		this.#task= new cron.schedule(`5 * * * *`, () => {
				console.log("deleting Game...")
				this.#game.deleteSelf()
			}, {
				timezone : "Europe/Paris"
			}
		)
	}

	destructor() {
		let channel = this.#game.getChannel()
		try {
			this.#hours = undefined
			this.#minutes = undefined
			this.#task.destroy()
			this.#game = undefined
		} catch (e) {
			sendThenDelete(channel, `${e}`)
			return console.log('------ error deleting cron obj! ------')
		}
	}
}

module.exports = {
	Cron
}