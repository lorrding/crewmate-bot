const ytdl = require('ytdl-core')

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

	deleteMessage : async function (client, message, ms = 0) {
		try {
			message.delete({timeout: ms})
		} catch (error) {
			console.log(`Error deleting message...\n${error}`);
		}
		// let guild = client.guilds.fetch(message.guild.id)
		// let member = (await guild).members.fetch(client.user.id)
		// if ((await member).hasPermission('MANAGE_MESSAGES')) {
		// 	return message.delete({timeout : ms})
		// }else {
		// 	return 0;
		// }
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

	inDev : function (channel) {
		const { sendThenDelete } = require('./toolbox')
		console.log('MODE DEV, ignoring...')
		return sendThenDelete(channel, "I'm currently in dev! try again later or mp lording#0400.")
	},

	play : function (connection, message, url) {
		const { sendThenDelete } = require('./toolbox')

		let valide
		try {
			valide = ytdl.validateURL(url)
			if (!valide) return sendThenDelete(message.channel, "format de vidéo invalide!")
		} catch (e) {
			return sendThenDelete(message.channel, `${e}`)
		}
		try {
			connection.play(ytdl(`${url}`, {quality: 'highestaudio'}), {volume: 0.5})
		} catch (e) {
			return sendThenDelete(message.channel, `${e}`)
		}
		message.delete()
		return sendThenDelete(message.channel, "👌")
	},

	showDate : function (date, utc) {
		if (utc) {
			return `${date.getUTCHours()+1}h${date.getUTCMinutes()} ${date.getUTCDate()}/${date.getUTCMonth()+1}/${date.getUTCFullYear()}`
		} else {
			return `${date.getHours()}h${date.getMinutes()} on ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
		}
	},

	getReaction : function (reaction) {
		if (reaction.partial) {
			console.log('partial reaction. Fetching...')
			reaction.fetch()
				.then(fullReaction => {
					return fullReaction
				})
				.catch(e => {
					console.log('Something went wrong when fetching the reaction: ', e);
				})
		} else {
			console.log('The reaction is not partial.')
			return reaction
		}
	}

	// disconnect : function (connection) {
	// 	return connection.disconnect()
	// }

	// random number between to included integers
	// getRandom : function (min, max) {
	// 	return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) +1)) + Math.ceil(min);
	// }
}