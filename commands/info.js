const {MessageEmbed} = require('discord.js')
const {sendThenDelete, getHexa, showDate} = require("../toolbox")

module.exports = {
	name: "info",
	description: "gives infos about the bot and the settings of this server",
	async execute(message, mp) {
		if (typeof  mp === "boolean" && !mp && message.channel.type !== 'text') return sendThenDelete(message.channel, `Commande non disponible en dehors d'un serveur`)
		const guild = message.client.botGuilds.get(message.guild.id)
		let fetched = false


		let embed = new MessageEmbed()
		embed.setColor(getHexa())
		embed.setTitle(`Info du ${message.client.user.username}`)

		let date = new Date()
		embed.addField('Heure (du serveur du bot)', showDate(date, false, true))

		if (mp && message.channel.type === 'text') embed.addField('Serveur concerné', message.guild.name)

		let game = "Aucune <:Melon:796872457888858132>"
		let queue = "Aucune <:Melon:796872457888858132>"

		if (!guild) {
			console.log("guild not found")
			embed.addField('Prefix sur ce serveur', '/')
			embed.addField('Message de bienvenue', 'Aucun')
			sendEmbed(message, embed, game, queue, mp)
		} else {
			embed.addField('Prefix sur ce serveur', guild.prefix)
			embed.addField('Message de bienvenue',`${guild.greetings ? `${guild.greetings_msg}` : "Aucun"}`)
			if (guild.queue !== null) {
				queue = "Soon.. <:Melon:796872457888858132>"
			}

			if (guild.game !== null) {
				game = `Une partie est prévue à ${guild.game.hours}h${guild.game.minutes} ici:`
				message.client.channels.fetch(guild.game.channelID).then(channel => {
					channel.messages.fetch(guild.game.messageID).then(message => {
						game += `\n${message.url}`

						sendEmbed(message, embed, game, queue, mp)
					})
				})
			} else {
				sendEmbed(message, embed, game, queue, mp)
			}
		}
		// embed.addField('Game prévue', game)
		// embed.addField('Liste de musique', queue)
		//
		// if (typeof  mp === "boolean" && mp && message.channel.type === 'text') {
		// 	message.author.createDM().then(DMChannel => {
		// 		DMChannel.send(embed).then(
		// 			message.author.deleteDM()
		// 		)
		// 	})
		// } else {
		// 	sendThenDelete(message.channel, embed, 60000)
		// }
	}
}

function sendEmbed(message, embed, game, queue, mp) {
	embed.addField('Game prévue', game)
	embed.addField('Liste de musique', queue)

	if (typeof  mp === "boolean" && mp && message.channel.type === 'text') {
		console.log("mp")
		message.author.send(embed).catch(e => console.error(e))
	} else {
		sendThenDelete(message.channel, embed, 60000)
	}
}