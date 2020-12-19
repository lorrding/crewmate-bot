const {sendThenDelete} = require("../toolbox")

module.exports = {
	name: "leave",
	aliases: ["deco"],
	description: "Leave a voice channel and delete the queue",
	execute(message) {
		if (!message.guild) return

		const { channel } = message.member.voice
		const queue = message.client.queue.get(message.guild.id)

		if (queue && channel !== message.guild.me.voice.channel) return sendThenDelete(message.channel, `Vous devez être dans le même channel que ${message.client.user}!`)

		if (queue) {
			console.log("queue found, deleting...")
			if (queue.songMessage && queue.songMessage.deletable) {
				queue.songMessage.delete()
			}
			message.client.queue.delete(message.guild.id)
		}

		if (message.member.hasPermission("MOVE_MEMBERS")) return message.guild.me.voice.channel.leave()

		if (message.member.voice.channelID === message.guild.me.voice.channelID) {
			message.member.voice.channel.leave()
			sendThenDelete(message.channel, `👌 déconnexion du vocal`, 15000)
		} else {
			sendThenDelete(message.channel, "Vous ne pouvez pas déconnectez le bot de la ou vous êtes!")
		}
	}
}