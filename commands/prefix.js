const {sendThenDelete} = require("../toolbox")
const {addGuild, updateGuild, fetchGuild} = require("../database")

module.exports = {
	name: "prefix",
	description: "change the prefix used to call the bot for this guild",
	execute(message, args) {
		if (message.channel.type !== 'text') return sendThenDelete(message.channel, `Commande non disponible en dehors d'un serveur`)
		if (!message.member.hasPermission("ADMINISTRATOR")) return sendThenDelete(message.channel, `403 forbidden command`)
		let arg = args[0]
		if (!arg || 0 > arg.length > 5) return sendThenDelete(message.channel, `prefix invalide`)

		let guild = message.client.botGuilds.get(message.guild.id)

		if (!guild) {
			addGuild(message.guild.id, arg, function (callback) {
				if (callback) {
					console.error(callback)
					return sendThenDelete(message.channel, `Erreur lors de l'update du prefix`)
				}
				fetchGuild(message.guild.id, function (data) {
					console.log('guild fetched')
					for (let guild of data) {
						message.client.botGuilds.set(guild.guild_id, guild)
					}
					console.log(`Updated prefix for ${message.guild.name}`)
					return sendThenDelete(message.channel, `prefix mit à jour`)
				})
			})
		} else {
			updateGuild(message.guild.id, arg, function (callback) {
				if (callback) {
					console.error(callback)
					return sendThenDelete(message.channel, `Erreur lors de l'update du prefix`)
				}
				guild.prefix = arg
				message.client.botGuilds.set(guild.guild_id, guild)
				console.log(`Updated prefix for ${message.guild.name}`)
				return sendThenDelete(message.channel, `prefix mit à jour`)
			})
		}
	}
}