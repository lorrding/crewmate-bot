const { Message, MessageEmbed } = require('discord.js')
const { sendThenDelete, formatEmbedTime, formatListPlayers, getHexa, saveGame, deleteGame } = require('../toolbox')
const { Cron } = require('./Cron')

class Game {

	#guild //guild the game is scheduled
	#channel //channel the game is scheduled
	#message = new Message(undefined, undefined, undefined) // embed that represent the game
	#author // author of the game as a user
	#listPlayers = [] // list of all players, excluding author as user
	#hours // hours of the game
	#minutes // minutes of the game
	#cron // cron object related to this game
	#manager // manager of every game

	static #EMOJI = "764917952600342539" // static emoji for adding players

	constructor(guild, channel, author, hours, minutes, manager, newGame) {
		this.#guild = guild
		this.#channel = channel
		this.#author = author
		this.#hours = hours
		this.#minutes = minutes
		this.#cron = new Cron(this.#hours, this.#minutes, true, this)
		this.#manager = manager

		if (newGame) {
			this.sendEmbed(this.createEmbed(), true)
		}
	}

	addPlayer(reaction, member) {

		//everything's ok
		try {
			// try adding user in list of players
			console.log(`Adding user ${member.username}...`)
			this.#listPlayers.push(member)
		} catch (error) {
			return sendThenDelete(this.#channel, `Error trying to add member to player list.`)
			.then(console.log(error))
		}

		//everything's good
		this.editEmbed()
	}

	removePlayer(user) { // removing role for a user
		console.log(`removing: ${user.username}`)
		// updating playerList
		try {
			this.#listPlayers.splice(this.#listPlayers.indexOf(user), 1)
		} catch (e) {
			return sendThenDelete(this.#channel, `${e}`)
		}
	}

	removeAllPlayers() { // removing role to every players of the game:

		// updating playerList
		this.#listPlayers = []
		this.#author = undefined
	}

	restoreGame(listPlayers, message) {
		let arrayPlayers = listPlayers.split(",")
		if (listPlayers.length > 0) {
			console.log("restoring players..")
			arrayPlayers.forEach(userID => {
				let member = this.#guild.members.cache.get(userID)
				this.#listPlayers.push(member.user)
			})
			console.log(`restored ${this.#listPlayers.length} players`)
		} else {
			console.log("no players to restore")
		}

		if (message === undefined) {
			console.log("re creating message..")
			this.sendEmbed(this.createEmbed(true), false)

		} else {
			this.#message = message
		}
	}

	deleteSelf() {
		// removing players
		this.removeAllPlayers()

		// removing game message
		this.#message.fetch().then(message => {
			message.delete().then(() => {
				// removing everything else
				this.#message = undefined
				this.#guild = undefined
				this.#hours = undefined
				this.#minutes = undefined
				this.#manager = undefined
				//removing cron obj
				this.#cron.destructor()
				this.#cron = undefined
				this.#channel = undefined
			})
		})

		// deleting game on db
		deleteGame(this)
		return true
	}

	createEmbed(restored = false) {
		//creating embed
		try {
			let embed = new MessageEmbed()
			embed.setColor(getHexa())
			embed.setAuthor(`${this.#author.username} propose de jouer à Among Us`, this.#author.avatarURL())
			embed.addField(`${formatEmbedTime(this.#hours, this.#minutes)} à:`,`${this.#hours}h${this.#minutes}`, true)
			if (this.#listPlayers.length) {
				embed.addField(`Places restantes:`,`${9 - this.#listPlayers.length}`, true)
				embed.addField(`avec:`, `${formatListPlayers(this.#listPlayers)}`)
			} else {
				embed.addField(`Places restantes:`,`9`, true)
			}
			embed.setImage(`https://i.imgur.com/8sd2fgo.png`)
			if (restored) {
				embed.setFooter(`Réagissez en dessous pour participer\n\nCe message à été renvoyé après une suppression. Inutile de réagir de nouveau si vous êtes listé dans la liste des joueurs`)
			} else {
				embed.setFooter(`Réagissez en dessous pour participer`)
			}
			console.log("sending embed...")
			return embed
		} catch (error) {
			return sendThenDelete(this.#channel, "Erreur lors de la création de l'embed.")
				.then(console.log(error))
		}
	}

	editEmbed() {
		let embed

		//try copying embed
		try {
			embed = new MessageEmbed(this.#message.embeds[0])
			embed.fields = []
		} catch (error) {
			return sendThenDelete(this.#channel, "Error copying embed.")
				.then(console.log(error))
		}

		//try updating fields
		try {
			embed.addField(`${formatEmbedTime(this.#hours, this.#minutes)} à:`,`${this.#hours}h${this.#minutes}`, true)

			if (this.#listPlayers.length) {
				embed.addField(`Places restantes:`,`${9 - this.#listPlayers.length}`, true)
				embed.addField(`avec:`, `${formatListPlayers(this.#listPlayers)}`)
			} else {
				embed.addField(`Places restantes:`,`9`, true)
			}
		} catch (error) {
			return sendThenDelete(this.#channel, "Error updating fields.")
				.then(console.log(error))
		}

		//try updating message embed
		try {
			this.#message.fetch().then(message => message.edit(embed))
			console.log("game message edited")
			//everything fine, adding to db.
			console.log("everything good, saving to db..")
			saveGame(this)
		} catch (error) {
			return sendThenDelete(this.#channel, "missing permissions to send embed or react.")
				.then(console.log(error))
		}
	}

	sendEmbed(embed, db = true) {
		try {
			//try sending embed
			this.#channel.send(embed)
			//adding reaction
				.then(embedMessage => {
					embedMessage.react(Game.#EMOJI).then(() => {})
					this.#message = embedMessage

					if (db) {
						console.log("everything's good, saving to db..")
						saveGame(this)
					} else {
						console.log("no db save needed")
					}
				})
		} catch (error) {
			sendThenDelete(this.#channel, "missing permissions to react or send embed.")
				.then(console.log(error))
		}
	}

	cronSchedule() {
		console.log(`Cron schedule ping for game in ${this.#channel.name} of ${this.getGuild()}`)
		// mentioning all players
		try {
			let str = ` C'est l'heure de jouer!\n`
			str += `${this.#author} `
			this.#listPlayers.forEach(player => {
				str += `<@!${player.id}> `
			});
			if (this.#listPlayers.length > 0) {
				str += `venez dans le vocal!`
				if (this.#listPlayers.length <= 5) str += `\n Mais il vous manquera surement quelques joueurs... <:AU_why:765273043962298410>`
			} else {
				str += `\nIl te manque des amis par contre <:AU_why:765273043962298410>`
			}
			sendThenDelete(this.#channel, str, 300000)
		} catch (error) {
			return sendThenDelete(this.#channel, 'Error mentioning all players!')
				.then(console.log(error))
		}
		try {
			sendThenDelete(this.#channel, "<:AU_gun:765273098336337970>", 300000).then(() => {
				//removing game from manager
				this.#manager.removeGame(this, this.#message)
				//deleting game after 5 minutes
				this.#cron.deleteRelatedGame()
			})
		} catch (e) {
			return sendThenDelete(this.#channel, `${e}`)
		}
	}

	// getters //

	getGuild() {
		return this.#guild
	}

	getChannel() {
		return this.#channel
	}

	getMessage() {
		return this.#message
	}

	getAuthor() {
		return this.#author
	}

	getListPlayers() {
		return this.#listPlayers
	}

	getHours() {
		return this.#hours
	}

	getMinutes() {
		return this.#minutes
	}

	getEmoji() {
		return Game.#EMOJI
	}
}

module.exports = {
	Game
}