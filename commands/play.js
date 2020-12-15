const {sendThenDelete, play} = require("../toolbox")
const {help} = require("../help/help")

module.exports = {
	name: "play",
	description: "Play a Youtube video/stream resolvable link in the voice channel of the message author",
	async execute(message, args) {
		if (!message.guild) return

		if (!message.member.voice.channel || !message.member.voice.channel.joinable) return sendThenDelete(message.channel, "Vous n'êtes dans aucun channel vocal que je peux rejoindre!")

		// playing lofi
		console.log(args)
		let url = args[0]
		const connection = await message.member.voice.channel.join()

		switch (url) {
			case "lofi":
			case "-lofi":
				dispatcher = await play(connection, message, 'https://www.youtube.com/watch?v=5qap5aO4i9A')
				break;
			case "-help":
			case "-h":
				//help
				try {
					message.author.createDM().then(DMChannel => DMChannel.send(help("-p")))
				} catch (e) {
					return sendThenDelete(message.channel, `${e}`)
				}
				if (message.channel.type !== "dm") {
					try {
						await message.delete()
					} catch (e) {
						return sendThenDelete(message.channel, `${e}`)
					}
				}
				break;
			default:
				dispatcher = await play(connection, message, url)
				break;
		}
	}
}