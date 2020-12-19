const {sendThenDelete, canUpdateQueue} = require("../toolbox")

module.exports = {
	name: "volume",
	aliases: ["v"],
	description: "Change volume of currently playing music",
	execute(message, args) {
		const queue = message.client.queue.get(message.guild.id)
		if (!queue) return sendThenDelete(message.channel, `Aucune musique n'est en court!`)
		if (!canUpdateQueue(message.member)) return

		if (!args[0]) return sendThenDelete(message.channel, `🔊 Le volume actuelle est de: **${queue.volume}%**`)
		if (isNaN(args[0]) || Number(args[0] > 100) || Number(args[0] < 0)) return sendThenDelete(message.channel, `Ce n'est pas un nombre valide!`)

		queue.volume = args[0]
		queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100)

		return sendThenDelete(message.channel, `🔊 Volume modifier à **${args[0]}%** par ${message.author}`, 15000)
	}
}