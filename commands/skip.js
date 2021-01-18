const { sendThenDelete, canUpdateQueue } = require("../toolbox")

module.exports = {
	name: "skip",
	aliases: ["s"],
	description: "Skip the currently playing song",
	execute(message) {
		const queue = message.client.queue.get(message.guild.id)
		if (!queue) return sendThenDelete(message.channel, `Aucune musique n'est en court!`)
		if (!canUpdateQueue(message.member)) return

		queue.playing = true
		if (queue.connection.dispatcher) queue.connection.dispatcher.end()
		return sendThenDelete(message.channel, `${message.author} ⏭ a skip la musique`, 15000)
	}
}