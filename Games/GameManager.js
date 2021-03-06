const { sendThenDelete } = require('../toolbox')
const { MessageEmbed } = require('discord.js')
const { Game } = require('./Game')
const { CronManager } = require('./CronManager')

//class used to manager every game objects
class GameManager {
	#gameList = []
	#guildList = []
	#authorList = []
	#CronManager

	constructor(CDJChannel, cmd) {
		this.#CronManager = new CronManager(CDJChannel, cmd)
		console.log("game manager ready")
	}

	createGame(guild, channel, author, tempHeures, tempMinutes, newGame = true) {
		this.#gameList.push(new Game(guild, channel, author, tempHeures, tempMinutes, this, newGame))
		this.#guildList.push(guild)
		return this.#authorList.push(author)
	}

	deleteGame(message) {

		// checking if a game exist
		if (this.#gameList.length > 0) {
			// checking if a game is currently scheduled in the channel
			if (!this.#gameList.some(game => game.getChannel().id === message.channel.id)) return sendThenDelete(message.channel, "Aucun partie n'est prévue dans ce channel!")

			// checking if message's author is a game author or has admin rights
			if (!(this.#gameList.some(game => game.getAuthor().id === message.author.id) || message.member.hasPermission('ADMINISTRATOR'))) {
				sendThenDelete(message.channel, `Vous n'êtes à l'origine d'aucune partie ou n'avez pas les droits suffisants pour en annuler!`)
			}
		} else {
			sendThenDelete(message.channel, "Aucun partie n'est prévue dans ce channel!")
			return message.delete()
		}


		let game

		if (this.#gameList.some(game => game.getAuthor().id === message.author.id)) {
			console.log('user deleting his own game');
			sendThenDelete(message.channel, "Suppression de votre partie...")
			game = this.#gameList.find(game => game.getAuthor().id === message.author.id)
		} else {
			console.log('admin deleting a game..');
			sendThenDelete(message.channel, "Par les pouvoir de l'admin, j'exige la suppression de la partie liée à ce channel...")
			game = this.#gameList.find(game => game.getChannel().id === message.channel.id)
		}

		//removing game from manager
		this.removeGame(game, message)
		//deleting game
		game.deleteSelf()
		return 0
	}

	addGame(message, args) {
		if (!this.#guildList.some(guild => guild.id === message.guild.id)) {
			if (!this.#authorList.some(author => author.id === message.author.id)) {
				if (this.#CronManager.checkArgs(message, args) === true) {
					let formattedArgs = this.#CronManager.formatArgs(message, args)
					let hours = formattedArgs.shift()
					let minutes = formattedArgs.shift()
					this.createGame(message.guild, message.channel, message.author, hours, minutes)
				}
			} else {
				sendThenDelete(message.channel, `Vous êtes déjà l'auteur d'une partie prévue!`)
			}
		} else {
			sendThenDelete(message.channel, `Une partie existe déjà sur ce serveur Discord!`)
		}
	}

	removeGame(game, message) {
		try {
			console.log("removing game from gameList, guildList and authorList")
			this.#gameList.splice(this.#gameList.indexOf(game), 1)
			this.#guildList.splice(this.#guildList.indexOf(game.getGuild()), 1)
			this.#authorList.splice(this.#authorList.indexOf(game.getAuthor()), 1)
			sendThenDelete(message.channel,"Suppression terminée!")
		} catch (e) {
			return sendThenDelete(message.channel, `${e}`)
		}
	}

	async manageAddReaction(reaction, user) {
		// no game
		if (!this.#gameList.length) return

		//wrong reaction
		if (reaction.emoji.id !== this.#gameList[0].getEmoji()) return
		console.log(`added reaction emoji by ${user.username}#${user.discriminator} in '${reaction.message.channel}' of '${reaction.message.guild}'`)

		// check if reaction is on a guild where there is a game:
		if (!this.#guildList.some(guild => guild.id === reaction.message.guild.id)) return false
		console.log('guild : check')

		// check if reaction is on a message attached to a game:
		if (!this.#gameList.some(game => {
			let message = game.getMessage()
			return message.id === reaction.message.id
		})) { return false }
		console.log('message : check')

		let game = this.#gameList.find(game => game.getMessage().id === reaction.message.id)

		//check if user isn't author of the game
		if(game.getAuthor().id === user.id) {
			console.log('author already un list, ignoring...')
			sendThenDelete(reaction.message.channel, "La personne qui propose de jouer est déjà dans la liste des joueurs, pas besoin de réagir au message!")
			try {
				await reaction.users.remove(user)
			} catch (error) {
				return console.log(error)
			}
			return false
		}

		//check if game list isn't full
		if (game.getListPlayers().length >= 14) {
			console.log('Max player reached, removing reaction.')
			sendThenDelete(reaction.message.channel, "Nombre de joueurs max atteint!")
			sendThenDelete(reaction.message.channel, "<:AU_why:765273043962298410>")
			try {
				await reaction.users.remove(user)
			} catch (error) {
				return console.log(error)
			}
			return false
		}

		// check if user isn't already in players list
		if (game.getListPlayers().length > 0 && game.getListPlayers().some(player => player.username === user.username)) {
			console.log('user already un list, ignoring...')
			return sendThenDelete(reaction.message.channel, "Vous êtes déjà dans la liste des joueurs! (Si vous voyez ce message, c'est soit une erreur soit que vous avez réagis à une partie restaurée)")
		}
		console.log("game list : check")

		//everything good
		game.addPlayer(reaction, user)
	}

	async manageRemoveReaction(reaction, user) {

		//wrong reaction
		if (reaction.emoji.id !== this.#gameList[0].getEmoji()) return
		console.log(`Removed reaction emoji by ${user.username}#${user.discriminator} in '${reaction.message.channel}' of '${reaction.message.guild}'`)

		// check if reaction is on a guild where there is a game:
		if (!this.#guildList.some(guild => guild.id === reaction.message.guild.id)) return false
		console.log('guild : check')

		// check if reaction is on a message attached to a game:
		if (!this.#gameList.some(game => {
			let message = game.getMessage()
			return message.id === reaction.message.id
		})) { return false }
		console.log('message : check')

		let game = this.#gameList.find(game => game.getMessage().id === reaction.message.id)

		//check if user is author of the game
		if(game.getAuthor().id === user.id) return false

		// check if user is already in players list
		if (game.getListPlayers().length > 0 && game.getListPlayers().some(player => player.username === user.username)) {
			console.log('user found, removing...')
			//removing player
			game.removePlayer(user)
			// updating embed
			return game.editEmbed()
		}

		// in case nothing is found..
		console.log("no user found... error")
	}

	dumpVars() {
		let embed = new MessageEmbed()
		try {
			console.log(`looping through ${this.#gameList.length} game(s)`)
			if (this.#gameList.length) {
				this.#gameList.forEach(game => {
					embed.addField("Guild",game.getGuild().name)
					embed.addField("Channel",game.getMessage().channel.name)
					embed.addField("Author",game.getAuthor().username)
					embed.addField("Time:",`${game.getHours()}h${game.getMinutes()}`)
					embed.addField("Players",game.getGuild().name)
				})
				return embed
			}
			return "no game..";
		} catch (e) {
			return e
		}
	}

	restoreDB(client) {
		client.botGuilds.forEach(guild => {
			if (guild.game !== null) {
				console.log(`\ngame found for ${guild.id}. Fetching game data...`)
				try {
					let gameChannel
					let gameGuild
					let gameMessage
					let gameAuthor
					let listPlayers
					let hours
					let minutes

					client.channels.fetch(guild.game.channelID).then(channel => {
						gameChannel = channel

						gameGuild = gameChannel.guild
						listPlayers = guild.game.listPlayers
						hours = guild.game.hours
						minutes = guild.game.minutes

						gameGuild.members.fetch(guild.game.authorID).then(member => {
							gameAuthor = member.user

							console.log("game data fetched.. recreating game..")
							this.createGame(gameGuild, gameChannel, gameAuthor, hours, minutes, false)

							let game = this.#gameList.find(game => game.getAuthor().id === gameAuthor.id)

							gameChannel.messages.fetch(guild.game.messageID).then(message => {
								gameMessage = message

								if (game) {
									game.restoreGame(listPlayers, gameMessage)
								}
							}).catch(e => {
								console.log("Message not found")
								if (game) {
									game.restoreGame(listPlayers, undefined)
								}
							}).catch(console.error)
						}).catch(console.error)
					}).catch(console.error)
				} catch (e) {
					return console.error(e)
				}
			}
		})
	}
}



module.exports = {
	GameManager
}