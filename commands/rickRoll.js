const {sendThenDelete, play} = require("../toolbox")

let dispatcher

module.exports = {
	name: "rr",
	aliases: ["rickroll"],
	description: "rickroll someone",
	async execute(message) {
		// checking if the message come from a guild
		if (!message.guild) return
		if (message.member.voice.channel && message.member.voice.channel.joinable) {
			const connection = await message.member.voice.channel.join()
			dispatcher = await play(connection, message, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ')
		} else {
			sendThenDelete(message.channel, "Cannot rickRoll here")
		}
	}
}