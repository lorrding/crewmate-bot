const {sendThenDelete} = require("../toolbox")

module.exports = {
	name: "dev",
	description: "dev mode. Used whenever i'm developing and the bot is up on my local machine",
	execute(message) {
		if (message.author.id !== "224230450099519488") return
		if (message.client.dev) {
			sendThenDelete(message.channel, `retour en mode normal.`).then(message.client.dev = false)
		} else {
			sendThenDelete(message.channel, `Ok, passage en dev mode.`).then(message.client.dev = true)
		}
		message.delete()
	}
}