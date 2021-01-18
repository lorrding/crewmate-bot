const {sendThenDelete} = require("../toolbox")
const { MessageEmbed } = require('discord.js')

module.exports = {
	name: "queue",
	aliases: ["q"],
	description: "Show every song that is waiting to be played in your ears",
	execute(message) {
		const queue = message.client.queue.get(message.guild.id)
		if (!queue) return sendThenDelete(message.channel, `Aucune musique n'est en court!`)

		let embed = new MessageEmbed()
			.setColor('#FF0000')
		let nb = 0
		queue.songs.forEach((song) => {
			embed.addField(`${++nb}:`,
				`${song}`,
				false
			)
		})
		sendThenDelete(message.channel, embed, 30000)
	}
}