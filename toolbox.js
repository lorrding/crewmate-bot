const {MessageEmbed} = require('discord.js')

module.exports = {
	//send a message, then delete it after x millisecondes
	sendThenDelete : function (channel, message, ms = 5000) {
		try {
			return channel.send(message)
			.then(msg=> {
				msg.delete({timeout: ms})
			})
		} catch (error) {
			console.log(`Error deleting message...\n${error}`);
		}
	},

	// format text for game embed message
	formatEmbedTime : function(hours, minutes) {
		let str = ""
		let date = new Date()
		
		//today or tomorrow ? utc+1 = summer /---/ utc+0 = winter
		console.log("creating embed time..")
		if (date.getUTCHours()+1 < hours) {str += "Ce "}
		else if (date.getUTCHours()+1 == hours) {
			if (date.getUTCMinutes() < minutes) {str += "Ce "}
			else {str += "Demain "}
		} else {str += "Demain "}

		// morning, evening, night..?
		if (hours >= 18 || hours < 3) {
			str += "soir"
		} else if (hours >= 14) {
			if (str === "Ce ") {
				str = str.slice(0, -1)
				str += "t après-midi"
			} else  {
				str += "après-midi"
			}
		} else if (hours >= 12) {
			str += "midi"
		} else {
			str += "matin"
		}
		return str
	},

	// format list of players
	formatListPlayers : function(listPlayers) {
		let listToString = ""
		for (let i = 0; i < listPlayers.length; i++) {
			if (listPlayers.length > 1) {
				if (i >= listPlayers.length-1) {
					//on remove ", "
					listToString = listToString.slice(0, -2)
					// et on met le dernier élément à la place
					listToString+=` et ${listPlayers[i]}.`
				} else {
					listToString+=`${listPlayers[i]}, `
				}
			} else {
				listToString+=`${listPlayers[i]}.`
			}
		}
		return listToString
	},

	// random hexadecimal number for embeds color
	getHexa : function () {
		return '#'+Math.floor(Math.random()*16777215).toString(16);
	},
	
	help : function (arg = null) {
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
			default:
				message.setTitle("help -{Argument}")
				message.setDescription("La commande **/help** vous affiche les différentes commandes utilisables pour interagir avec le bot.")
				message.addFields([
					{ name: 'game*', value: "Permet de créer une partie dans le channel actuel"},
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

	// random number between to included integers
	// getRandom : function (min, max) {
	// 	return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) +1)) + Math.ceil(min);
	// }
}