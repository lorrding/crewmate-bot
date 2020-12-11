const {sendThenDelete} = require("../toolbox")

module.exports = {
	name: "stop",
	aliases: ["leave"],
	description: "Leave a voice channel",
	execute(message) {
		if (!message.guild) return
			message.client.guilds.fetch(message.guild.id).then( guild => {
				guild.members.fetch(message.client.user.id).then( member => {
					if (message.member.voice.channel.id === member.voice.channel.id || member.hasPermission("MOVE_MEMBERS")) {
						member.voice.channel.leave()
					} else {
						sendThenDelete(message.channel, "Vous ne pouvez pas déconnectez le bot de la ou vous êtes")
					}
				})
			})
		message.delete()
	}
}