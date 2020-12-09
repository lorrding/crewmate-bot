const ytdl = require('ytdl-core-discord')
const {validateURL} = require('ytdl-core')
const { sendThenDelete } = require('../../toolbox')

let dispatcher;

module.exports = {
	voice
}

function voice(message, command, args, client) {
	switch (command) {
		case "rr":
			return rickRoll(message)
		case "play":
			return playMusic(message, args[0])
		default:
			return "0"
	}
}

async function rickRoll(message) {
	// checking if the message come from a guild
	if (!message.guild) return
	if (message.member.voice.channel && message.member.voice.channel.joinable) {
		const connection = await message.member.voice.channel.join()
		dispatcher = await play(connection, message, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ')
	} else {
		sendThenDelete(message.channel, "Cannot rickRoll here")
	}
}

async function playMusic(message, arg) {
	// checking if the message come from a guild
	if (!message.guild) return

	if (message.member.voice.channel && message.member.voice.channel.joinable) {
		// playing lofi
		let url = arg
		const connection = await message.member.voice.channel.join()

		switch (url) {
			case "lofi": case "-lofi":
				dispatcher = await play(connection, message, 'https://www.youtube.com/watch?v=5qap5aO4i9A')
				break;
			case "-help": case "-h":
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
	} else {
		sendThenDelete(message.channel, "Vous n'êtes dans aucun channel vocal que je peux rejoindre!")
	}
	// deleteMessage(client, message)
}

function play(connection, message, url) {
	if (!validateURL(url)) return sendThenDelete(message.channel, "format de vidéo invalide!")
	sendThenDelete(message.channel, "👌")
	return connection.play(ytdl(url), {type: 'opus'})
}