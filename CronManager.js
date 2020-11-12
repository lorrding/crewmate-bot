const { sendThenDelete } = require('./toolbox')
const cron = require('node-cron')

//class used to manager every Cron objects
class CronManager {
	// #gameList = new Array()
	// #guildList = new Array()
	// #authorList = new Array()

	constructor() {
	}

	// checking if arguments of a message are matching 24h format (0-23[h|:]0-59)
	checkArgs(message, args) {
		let regex = /^([0-9]|0[0-9]|1[0-9]|2[0-3])[:|h][0-5][0-9]$/
		let time = args.shift()
		let match = time.match(regex)
		if (match==null) {
			console.log('invalid time format, return')
			return sendThenDelete(message.channel, "Format d'heure invalide \nL'heure doit être sous la forme ```0-23[h|:]0-59```")
		}
		console.log(`valide time format, proceeding...`)
		if (time.search("h") !== -1) {
			console.log('detecting h..')
			time = time.split("h")
		} else {
			console.log('no h detected, assuming ":"..')
			time = time.split(":")
		}
		// checking time for cron format
		if (cron.validate(`${time[0]} ${time[1]} * * *`)) {
			console.log(`valide cron format..`)
		} else {
			console.log('invalid cron fromat!')
			return sendThenDelete(message.channel, "Erreur du formatage Cron! faut contacter le dev là c'est la panade'")
		}
		return time
	}
}

module.exports = {
	CronManager
}