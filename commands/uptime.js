const {MessageEmbed} = require('discord.js')
const {sendThenDelete} = require("../toolbox")

module.exports = {
	name: "uptime",
	aliases: ["up"],
	description: "Check uptime of the bot",
	execute(message) {
		let seconds = Math.floor(message.client.uptime / 1000)
		let minutes = Math.floor(seconds / 60)
		let hours = Math.floor(minutes / 60)
		let days = Math.floor(hours / 24)

		seconds %= 60
		minutes %= 60
		hours %= 24

		return sendThenDelete(message.channel, new MessageEmbed()
			.setColor('#00FFFF')
			.setAuthor(`${message.author.username} -> uptime`, `${message.author.avatarURL()}`)
			.addField(`Current uptime:`,`${days} day(s), ${hours} hours, ${minutes} minutes, ${seconds} seconds`), 30000
		).then(() => message.delete())
	}
}