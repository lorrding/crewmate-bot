const {MessageEmbed} = require('discord.js')
const {sendThenDelete, getHexa, showDate} = require("../toolbox")

module.exports = {
	name: "info",
	description: "gives infos about the bot and the settings of this server",
	async execute(message, mp) {
		if (!mp && message.channel.type !== 'text') return sendThenDelete(message.channel, `Commande non disponible en dehors d'un serveur`)
		const guild = message.client.botGuilds.get(message.guild.id)

		if (!guild) {
			console.log("guild not found")
		}

		let embed = new MessageEmbed()
		embed.setColor(getHexa())
		embed.setTitle(`Info du ${message.client.user.username}`)
		let date = new Date()
		embed.addField('Heure du serveur (du bot)', showDate(date, false, true))

		if (mp && message.channel.type === 'text') embed.addField('Serveur concerné', message.guild.name)
		embed.addField('Prefix sur ce serveur', guild.prefix)
		let game = "Aucune <:Melon:796872457888858132>"
		if (guild.game !== 'null') {
			game = "Todo <:Melon:796872457888858132>"
		}
		embed.addField('Game prévue', game)
		let queue = "Aucune <:Melon:796872457888858132>"
		if (guild.queue !== 'null') {
			queue = "Todo <:Melon:796872457888858132>"
		}
		embed.addField('Liste de musique', queue)

		if (mp && message.channel.type === 'text') {
			await message.author.createDM().then(DMChannel => DMChannel.send(embed))
			await message.author.deleteDM()
		} else {
			sendThenDelete(message.channel, embed, 60000)
		}
	}
}