const {sendThenDelete} = require("../toolbox")

module.exports = {
	name: "stop",
	aliases: ["leave"],
	description: "Leave a voice channel",
	execute(message) {
		if (!message.guild) return

		if (message.member.hasPermission("MOVE_MEMBERS")) return message.guild.me.voice.channel.leave()

		if (message.member.voice.channelID === message.guild.me.voice.channelID) {
			message.member.voice.channel.leave()
		} else {
			sendThenDelete(message.channel, "Vous ne pouvez pas déconnectez le bot de la ou vous êtes")
		}
	}
}