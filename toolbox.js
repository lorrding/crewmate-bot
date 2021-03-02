const ytdl = require('ytdl-core')
const ytpl = require('ytpl')

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

	inDev : function (message) {
		console.log('MODE DEV, ignoring...')
		self.sendThenDelete(message.channel, "I'm currently in dev! try again later or mp lording#0400.")
		if (message.guild.me.hasPermission("MANAGE_MESSAGES")) {
			message.delete()
		}
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
				queue.textChannel.send(`👌 en train de jouer: ${queue.songs[0]}`).then(msg => {
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
					if (queue.songMessage && queue.songMessage.deletable) {
						queue.songMessage.delete()
					}
					queue.channel.client.queue.delete(queue.textChannel.guild.id)
				}
			} else {
				return self.play(queue)
			}
		})
	},

	queueAdd: async function (url, queue) {
		if (queue.isPlaylist) {
			console.log(`queue size: ${queue.songs.length}`)

			queue.playlist = await ytpl(`${url}`, {pages: 1})
			console.log(`Playlist size: ${queue.playlist.items.length}`)
			if (queue.playlist.items.length) {
				queue.playlist.items.forEach(music => {
					queue.songs.push(music.shortUrl)
					if (queue.songs.length === 1) {
						console.log(`only one song, playing..`)
						self.play(queue)
					}
				})
				queue.isPlaylist = false
			} else {
				return self.sendThenDelete(queue.textChannel, `Erreur, aucune musique trouvé dans la playlist!`)
			}
			queue.isPlaylist = false
			self.sendThenDelete(queue.textChannel, `👌 Playlist ajouté.`)
			return queue.textChannel.guild.client.queue.set(queue.textChannel.guild.id, queue)
		} else {
			console.log(`queue size: ${queue.songs.length}`)
			queue.songs.push(url)
			if (queue.songs.length === 1) {
				console.log(`only one song, playing..`)
				self.play(queue)
			} else {
				self.sendThenDelete(queue.textChannel, `👌 Musique ajouté à la liste d'attente.`)
			}
		}
	},

	canUpdateQueue : function (member) {
		return member.voice.channelID === member.guild.voice.channelID
	},

	showDate : function (date, utc, info) {
		if (utc) {
			return `${date.getUTCHours()+1}h${date.getUTCMinutes()} ${date.getUTCDate()}/${date.getUTCMonth()+1}/${date.getUTCFullYear()}`
		} else {
			let type = "on"
			if (info) type = "le"
			return `${date.getHours()}h${date.getMinutes()} ${type} ${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
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
			return reaction
		}
	},

	getPrefix : function (message) {
		if (message.channel.type !== 'text') return message.client.prefix
		let guild = message.client.botGuilds.get(message.guild.id)
		if (guild) return guild.prefix
		return message.client.prefix
	},

	clearCDJ : function (CDJChannel, cmd) {
		console.log("\npurging from cron")
		cmd.execute(undefined, null, true, CDJChannel).catch(() => {})
	},

	saveGame(game) {
		const {fetchGuild, addGuildGame, updateGuildGame} = require('./database')

		let listPlayers = ''

		game.getListPlayers().forEach(player => {
			listPlayers += player.id+','
		})
		if (listPlayers.length > 1) {
			listPlayers = listPlayers.slice(0, -1)
		}
		let json = JSON.stringify({guildID: `${game.getGuild().id}`, channelID: `${game.getChannel().id}`, messageID: `${game.getMessage().id}`, authorID: `${game.getAuthor().id}`, listPlayers: listPlayers ,hours: `${game.getHours().toString()}`, minutes: `${game.getMinutes().toString()}`})

		json = JSON.parse(json)

		let guild = game.getGuild().client.botGuilds.get(game.getGuild().id)
		if (!guild) {
			addGuildGame(game.getGuild().id, json, function (callback) {
				if (callback) {
					console.error(callback)
					return self.sendThenDelete(game.getChannel(), `Erreur lors de l'update de la game`)
				}
				fetchGuild(game.getGuild().id, function (data) {
					console.log('guild fetched')
					for (let guild of data) {
						game.getGuild().client.botGuilds.set(guild.id, guild)
					}
					console.log(`Updated game for ${game.getGuild().name}`)
					return true
				})
			})
		} else {
			updateGuildGame(game.getGuild().id, json, function (callback) {
				if (callback) {
					console.error(callback)
					return self.sendThenDelete(game.getChannel(), `Erreur lors de l'update de la game`)
				}
				guild.game = json
				game.getGuild().client.botGuilds.set(guild.id, guild)
				console.log(`Updated game for ${game.getGuild().name}`)
				return true
			})
		}
	},

	deleteGame(game) {
		const {updateGuildGame} = require('./database')
		let guild = game.getGuild().client.botGuilds.get(game.getGuild().id)
		if (guild) {
			updateGuildGame(game.getGuild().id, null, function (callback) {
				if (callback) {
					console.error(callback)
					return self.sendThenDelete(game.getChannel(), `Erreur lors de l'update de la game`)
				}
				guild.game = null
				game.getGuild().client.botGuilds.set(guild.id, guild)
				console.log(`Removed game for ${game.getGuild().name}`)
				return true
			})
		}else {
			console.log("error, no guild on cache")
			return -1
		}
	}
}