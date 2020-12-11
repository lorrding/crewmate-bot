const {sendThenDelete} = require("../toolbox")

module.exports = {
	name: "stop",
	aliases: ["leave"],
	description: "Leave a voice channel",
	execute(message) {
		if (!message.guild) return

		if (message.member.voice.channel) {
			message.client.guilds.fetch(message.guild.id).then( guild => {
				guild.members.fetch(message.client.user.id).then( member => {
					member.voice.channel.leave()
					// member.voice.connection.disconnect()
				})
			})
		} else {
			sendThenDelete(message.channel, "Vous n'êtes dans aucun channel vocal")
		}
		message.delete()
	}
}