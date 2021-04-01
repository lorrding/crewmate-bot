const {clearCDJ} = require("../toolbox")
const cron = require('node-cron')

class Cron {

	#hours // 0-23
	#minutes // 0-59
	#game // game related to this object
	#task // cron schedule

	constructor(hours, minutes, isGame, game, CDJChannel, cmd) {
		console.log("creating cron obj..")
		this.#hours = hours
		this.#minutes = minutes
		this.#game = game
		this.#task = new cron.schedule(`${this.#minutes} ${this.#hours} * * *`, () => {
			if (isGame) {
				console.log("It is time for me to ping..")
				game.cronSchedule()
			} else {
				clearCDJ(CDJChannel, cmd)
			}
		}, {
			// timezone : "Europe/Paris"
			timezone : "Europe/Riga"
			}
		)
		console.log("cron obj is running..")
	}

	deleteRelatedGame() {
		console.log("15 minutes before deleting game")
		this.#task.destroy()
		let timer = false;
		this.#task = new cron.schedule(`*/15 * * * *`, () => {
			if (timer) {
				console.log("15 minutes passed! Deleting Game...")
				this.#task.stop()
				this.#game.deleteSelf()
			} else timer = true
		}, {
			// timezone : "Europe/Paris"
			timezone : "Europe/Riga"
		})
		console.log("starting cron")
		this.#task.start()
	}

	destructor() {
		try {
			this.#hours = undefined
			this.#minutes = undefined
			this.#task.destroy()
			this.#game = undefined
		} catch (e) {
			console.log('------ error deleting cron obj! ------')
			return console.log(e)
		}
	}
}

module.exports = {
	Cron
}
