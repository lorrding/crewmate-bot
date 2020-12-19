const ytdl = require('ytdl-core')

const self = module.exports = {
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

		hours = parseInt(hours)

		//today or tomorrow ? utc+1 = summer /---/ utc+0 = winter
		console.log("creating embed time..")
		if (date.getUTCHours()+1 < hours) {str += "Ce "}
		else if (date.getUTCHours()+1 === hours) {
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
		console.log('MODE DEV, ignoring...')
		return self.sendThenDelete(channel, "I'm currently in dev! try again later or mp lording#0400.")
	},

	play : function (queue) {
		const url = queue.songs[0]
		try {
			const valide = ytdl.validateURL(url)
			if (!valide) {
				self.sendThenDelete(queue.textChannel, "format vidéo invalide!")
				return queue.channel.client.queue.delete(queue.channel.guild.id)
			}
		} catch (e) {
			return self.sendThenDelete(queue.textChannel, `${e}`)
		}

		try {
			queue.connection.play(ytdl(`${url}`, {quality: 'highestaudio'}))
		} catch (e) {
			return self.sendThenDelete(queue.textChannel, `${e}`)
		}
		queue.playing = true


		try {
			if (!queue.songMessage) {
				console.log("no message, creating..")
				queue.textChannel.send(`👌 currently playing : ${queue.songs[0]}`).then(msg => {
					queue.songMessage = msg
				})
			} else {
				if (queue.songMessage.editable) {
					console.log("message found, editing...")
					queue.songMessage.edit(`👌 en train de jouer: ${queue.songs[0]}`)
				}
			}
		} catch (e) {
			self.sendThenDelete(queue.textChannel, `${e}`)
		}
		queue.textChannel.guild.client.queue.set(queue.textChannel.guild.id, queue)

		queue.connection.dispatcher.on('finish', () => {
			queue.passed.push(queue.songs.shift())
			queue.textChannel.guild.client.queue.set(queue.textChannel.guild.id, queue)
			console.log(`end of current song in ${queue.channel.name}..`)
			if (!queue.songs.length) {
				if (queue.loop) {
					console.log("loop enabled, looping")
					queue.songs = queue.passed
					queue.passed = []
					queue.textChannel.guild.client.queue.set(queue.textChannel.guild.id, queue)
					return self.play(queue)
				} else {
					console.log(`no more songs to play, leaving`)
					queue.channel.leave()
					queue.channel.client.queue.delete(queue.textChannel.guild.id)
				}
			} else {
				return self.play(queue)
			}
		})
	},

	queueAdd: function(url, queue) {
		console.log(`queue size: ${queue.songs.length}`)
		queue.songs.push(url)
		if (queue.songs.length === 1) {
			console.log(`only one song, playing..`)
			self.play(queue)
		} else {
			self.sendThenDelete(queue.textChannel, `👌 Musique ajouté à la liste d'attente.`)
		}
	},

	canUpdateQueue : function (member) {
		return member.voice.channelID === member.guild.voice.channelID
	},

	showDate : function (date, utc) {
		if (utc) {
			return `${date.getUTCHours()+1}h${date.getUTCMinutes()} ${date.getUTCDate()}/${date.getUTCMonth()+1}/${date.getUTCFullYear()}`
		} else {
			return `${date.getHours()}h${date.getMinutes()} on ${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
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
	},

	// disconnect : function (connection) {
	// 	return connection.disconnect()
	// }

	// random number between to included integers
	// getRandom : function (min, max) {
	// 	return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) +1)) + Math.ceil(min);
	// }
}