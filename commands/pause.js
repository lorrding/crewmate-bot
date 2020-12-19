const {canUpdateQueue, sendThenDelete} = require("../toolbox")

module.exports = {
	name: "pause",
	aliases: ["stop"],
	description: "pause the current music",
	execute(message) {
		const queue = message.client.queue.get(message.guild.id)
		if (!queue || !queue.playing) return sendThenDelete(message.channel, `Aucune musique n'est en court!`)
		if (!canUpdateQueue(message.member)) return

		if (queue.playing) {
			queue.playing = false
			queue.connection.dispatcher.pause(true)
			console.log(`music paused by ${message.author.username}#${message.author.discriminator}`)
			return sendThenDelete(message.channel, `${message.author} ⏸ a mit la musique en pause.`, 15000)
		}
	}
}