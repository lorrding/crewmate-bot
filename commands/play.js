const {sendThenDelete , queueAdd, canUpdateQueue} = require("../toolbox")

module.exports = {
	name: "play",
	aliases: "p",
	description: "Play or unpause a Youtube video/stream resolvable link in the voice channel of the message author",
	async execute(message, args) {
		if (!message.guild) return

		const { channel } = message.member.voice
		const queueGetter = message.client.queue.get(message.guild.id)

		if (!channel || !channel.joinable) return sendThenDelete(message.channel, "Je ne peux pas rejoindre votre channel vocal!")

		if (queueGetter && channel !== message.guild.me.voice.channel) return sendThenDelete(message.channel, `Vous devez être dans le même channel que ${message.client.user}!`)

		let queue
		if (!queueGetter) {
			console.log("no queue, creating...")
			queue = {
				textChannel: message.channel,
				channel,
				songMessage: null,
				connection: null,
				songs: [],
				passed: [],
				loop: false,
				volume: 100,
				playing: false
			}
			message.client.queue.set(message.guild.id, queue)
		} else {
			console.log("queue found..")
			queue = queueGetter
			if (!queue.playing) {
				console.log("queue was paused.. playing again...")
				queue.connection.dispatcher.resume()
				queue.playing = true
				return sendThenDelete(message.channel, `▶ Reprise de la musique.`, 15000)
			}
		}

		let url = args[0]

		if (!queue.connection || message.member.hasPermission(('ADMINISTRATOR'))) {
			try {
				queue.connection = await message.member.voice.channel.join()
			} catch (e) {
				return sendThenDelete(message.channel, `${e}`)
			}
		} else {
			if (!canUpdateQueue(message.member)) {
				return sendThenDelete(message.channel, `Vous devez d'abord rejoindre le channel vocal!`)
			}
		}

		switch (url) {
			case "lofi":
			case "-lofi":
				// playing lofi
				queueAdd('https://youtu.be/5qap5aO4i9A', queue)
				break
			case "rr":
			case "-rr":
				// playing rickroll
				queueAdd('https://youtu.be/dQw4w9WgXcQ', queue)
				break
			default:
				queueAdd(url, queue)
				break
		}
	}
}

