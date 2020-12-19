const { sendThenDelete } = require("../toolbox")

module.exports = {
	name: "rr",
	aliases: ["rickroll"],
	description: "rickroll someone",
	async execute(message) {
		// checking if the message come from a guild
		if (!message.guild) return
		if (message.member.voice.channel && message.member.voice.channel.joinable) {
			const play = message.client.commands.get("play")
			play.execute(message, ["rr"])
		} else {
			sendThenDelete(message.channel, "Cannot rickRoll here")
		}
	}
}