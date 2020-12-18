const {sendThenDelete} = require("../toolbox")
let dev = false
exports.dev = dev

module.exports = {
	name: "dev",
	description: "dev mode. Used whenever i'm developing and the bot is up on my local machine",
	execute(message) {
		if (message.author.id !== "224230450099519488") return sendThenDelete(message.channel, `Je suis actuellement en développement! mp lording#0400 si besoin`)
		if (dev) {
			sendThenDelete(message.channel, `retour en mode normal.`).then(dev = false)
		} else {
			sendThenDelete(message.channel, `Ok, passage en dev mode.`).then(dev = true)
		}
		message.delete()
	}
}