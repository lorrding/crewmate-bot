const {sendThenDelete, canUpdateQueue} = require("../toolbox")

module.exports = {
	name: "loop",
	description: "Enable/Disable loop when playing",
	execute(message) {
		let queue = message.client.queue.get(message.guild.id)

		if (!queue) {
			sendThenDelete(message.channel, `Aucune musique n'est en cours sur ce serveur!`)
		}

		if (!canUpdateQueue(message.member)) {
			return sendThenDelete(message.channel, `Vous devez d'abord rejoindre le channel vocal!`)
		}

		queue.loop = !queue.loop

		console.log(`updating loop to: ${queue.loop}`)
		message.client.queue.set(message.guild.id, queue)

		if (queue.loop) {
			sendThenDelete(message.channel, "👌 Répétition activée")
		} else {
			sendThenDelete(message.channel, "👌 Répétition désactivée")
		}
		return 0
	}
}