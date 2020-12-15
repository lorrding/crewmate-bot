const Discord = require('discord.js')
const { sendThenDelete, formatEmbedTime, formatListPlayers, getHexa } = require('../toolbox')
const Cron = require('./Cron')

class Game {

	#guild //guild the game is scheduled
	#channel //channel the game is scheduled
	// #role //role to manage players
	#message = new Discord.Message(undefined, undefined, undefined) // embed that represent the game
	#author //= new Discord.User(new Discord.Client(), undefined) // author of the game as a user
	#listPlayers = [] // list of all players, excluding author as user
	#hours // hours of the game
	#minutes // minutes of the game
	#cron // cron object related to this game
	#manager // manager of every game

	static #EMOJI = "764917952600342539" // static emoji for adding players

	constructor(message, hours, minutes, manager) {
		this.#guild = message.guild
		// this.#role = message.guild.roles.cache.find(r => r.name === "joueurDuSoir");
		this.#channel = message.channel
		this.#author = message.author
		this.#hours = hours
		this.#minutes = minutes
		this.#cron = new Cron.Cron(this.#hours, this.#minutes, this)
		this.#manager = manager

		this.sendEmbed(this.createEmbed())

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

	deleteSelf() {
		// removing players
		this.removeAllPlayers()

		// removing game message
		this.#message.fetch().then(message => {
			message.delete().then(() => {
				// removing everything else
				this.#message = undefined
				this.#guild = undefined
				// this.#role = undefined
				this.#hours = undefined
				this.#minutes = undefined
				this.#manager = undefined
				//removing cron obj
				this.#cron.destructor()
				this.#cron = undefined
				this.#channel = undefined
			})
		})
		return true
	}

	createEmbed() {
		//creating embed
		try {
			let embed = new Discord.MessageEmbed()
			embed.setColor(getHexa())
			embed.setAuthor(`${this.#author.username} propose de jouer à Among Us`, this.#author.avatarURL())
			embed.addField(`${formatEmbedTime(this.#hours, this.#minutes)} à:`,`${this.#hours}h${this.#minutes}`, true)
			embed.addField(`Places restantes:`,`9`, true)
			embed.setImage(`https://i.imgur.com/8sd2fgo.png`)
			embed.setFooter(`Réagissez en dessous pour participer`)
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
			embed = new Discord.MessageEmbed(this.#message.embeds[0])
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
		} catch (error) {
			return sendThenDelete(this.#channel, "missing permissions to send embed or react.")
				.then(console.log(error))
		}
	}

	sendEmbed(embed) {
		try {
			//try sending embed
			this.#channel.send(embed)
			//adding reaction
				.then(embedMessage => {
					embedMessage.react(Game.#EMOJI).then(() => {})
					this.#message = embedMessage
				})
		} catch (error) {
			sendThenDelete(this.#channel, "missing permissions to react or send embed.")
				.then(console.log(error))
		}

		// try {
		// 	//try adding role to players
		// 	let player = this.#guild.members.cache.find(r => r.id === this.#author.id)
		// 	player.roles.add(this.#role)
		// } catch (error) {
		// 	sendThenDelete(this.#channel, 'missing permission to add role.')
		// 	.then(console.log(error))
		// }
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

	getGuild() {
		return this.#guild
	}

	// getRole() {
	// 	return this.#role
	// }

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