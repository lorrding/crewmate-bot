const { MessageEmbed } = require('discord.js')
const { sendThenDelete } = require("../toolbox")

module.exports = {
	name: "ping",
	description: "Show the bot's average ping and api latency",
	async execute(message) {
		let embed = new MessageEmbed()
			.setColor('#FFFFFF')
			.setAuthor(`${message.author.username} -> ping`, `${message.author.avatarURL()}`)
		const [m] = await Promise.all([message.channel.send("Ping?")])
		embed.addField(`Pong! (${m.createdTimestamp - message.createdTimestamp}ms).`, `Latence API: ${Math.round(message.client.ws.ping)}ms.`)
		sendThenDelete(message.channel, embed, 15000).then(() => message.delete())
		return m.delete()
	}
}