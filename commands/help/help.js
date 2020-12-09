const {MessageEmbed} = require('discord.js')

module.exports = {
	help
}

function help(arg = null) {
	console.log(`need help with arg: ${arg}`)
	let message = new MessageEmbed()
	let strFooter = `La plupart des commandes on une version "raccourcie" d'elle-même.\nExemple: /g -a 21h30`
	message.setFooter(`${strFooter}`)
	switch (arg) {
		case "-game":
		case "-g":
			message.setTitle("game -{Argument}")
			message.setDescription("La commande **/game** vous permet d'interagir avec le bot pour créer et modifier/supprimer les parties d'Among Us\n La liste des arguments est la suivante:")
			message.addFields([
				{ name: '-add {time}', value: "Crée une partie dans le channel actuel. l'argument **time** correspond à l'heure au format [0-23][h|:][0-59]"},
				{ name: '-delete', value: "Permet de supprimer la partie prévue dans ce channel. Vous devez être l'auteur de la partie ou administrateur"},
				{ name: '-dump EN PHASE DE TEST', value: 'Affiche les parties prévue sur ce serveur discord'},
				{ name: '-help', value: 'Affiche cet aide'}
			])
			break
		case "-play":
		case "-p":
			message.setTitle("play {Argument}")
			message.setDescription("La commande **/play** fait venir le bot dans votre salon vocal et joue la vidéo youtube en argument\n")
			message.addFields([
				{ name: 'url', value: "n'importe quel lien youtube valide"},
				{ name: 'lofi', value: "Stream directement du lofi"},
				{ name: 'doom', value: 'Stream directement du doom'},
				{ name: '-help', value: 'Affiche cet aide'}
			])
			break
		default:
			message.setTitle("help -{Argument}")
			message.setDescription("La commande **/help** vous affiche les différentes commandes utilisables pour interagir avec le bot.")
			message.addFields([
				{ name: 'game*', value: "Permet de créer une partie dans le channel actuel"},
				{ name: 'play*', value: "Rejoint le channel vocal et joue la vidéo youtube"},
				{ name: 'ping', value: "Affiche le ping du bot ainsi que celle de l'Api discord"},
				{ name: 'uptime', value: 'Affiche depuis quand le bot est actif (temps depuis le dernier reboot)'},
				{ name: 'help', value: 'Affiche ce message'},
				{ name: 'say', value: `Faire parler le bot (Vous seul êtes responsable de ce qu'il va dire)`},
				{ name: 'addme', value: `Permet d'ajouter le bot sur votre propre serveur`},
				{ name: 'SOON', value: `Et plus à venir...`}
			])
			message.setFooter(`${strFooter}\nLes commandes avec une * on une page d'aide dédiée`)
			break
	}
	return message
}