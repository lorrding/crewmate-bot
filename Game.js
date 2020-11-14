const Discord = require('discord.js')
const { sendThenDelete, formatEmbedTime, formatListPlayers, getHexa } = require('./toolbox')

class Game {

	#guild //guild the game is scheduled
	#channel //channel the game is scheduled
	#role //role to manage players
	#message = new Discord.Message(undefined, undefined, undefined) // embed that represent the game
	#author //= new Discord.User(new Discord.Client(), undefined) // author of the game as a user
	#listPlayers = [] // list of all players, excluding author as user
	#hours // hours of the game
	#minutes // minutes of the game
	static #EMOJI = "764917952600342539" // static emoji for adding players

	constructor(message, hours, minutes) {
		this.#guild = message.guild
		this.#role = message.guild.roles.cache.find(r => r.name === "joueurDuSoir");
		this.#channel = message.channel
		this.#author = message.author
		this.#hours = hours
		this.#minutes = minutes

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

		try {
			//try adding role to player
			let player = this.#guild.members.cache.find(r => r.id === member.id)
			player.roles.add(this.#role)
		} catch (error) {
			return sendThenDelete(this.#channel, 'missing permission to add role.')
			.then(console.log(error))
		}

		//everything's good
		this.editEmbed()
	}

	removePlayer(user) { // removing role from a user
		console.log(`removing: ${user.username}`)
		try {
			// getting user as guild member
			let member = this.#guild.members.cache.find(r => r.id === user.id)
			member.roles.remove(this.#role).then(() => {
				console.log("role removed from member..")})
		} catch (error) {
			return sendThenDelete(this.#channel, 'missing permission to remove role.')
				.then(console.log(error))
		}
		// updating playerList
		try {
			this.#listPlayers.splice(this.#listPlayers.indexOf(user), 1)
		} catch (e) {
			return sendThenDelete(this.#channel, `${e}`)
		}
	}

	removeAllPlayers() { // removing role to every players of the game:

		// removing role
		try {
			this.#listPlayers.forEach(player => {
				let member = this.#guild.members.cache.find(r => r.id === player.id)
				member.roles.remove(this.#role).then(() => {})
			});
			console.log("role removed for every player..")
		} catch (error) {
			return sendThenDelete(this.#channel, 'missing permission to remove role.')
				.then(console.log(error))
		}
		// removing role from author
		this.removePlayer(this.#author)
		console.log("role removed for author..")

		// updating playerList
		this.#listPlayers = []
	}

	deleteGame() {
		this.removeAllPlayers()
		this.#message.fetch().then(message => {
			message.delete().then(() => {})
		})
		return true
	}

	createEmbed() {
		//creating embed
		try {
			let embed = new Discord.MessageEmbed()
			embed.setColor(getHexa())
			embed.setAuthor(`${this.#author.username} propose de jouer`, this.#author.displayAvatarURL)
			embed.addField(`${formatEmbedTime(this.#hours, this.#minutes)} à:`,`${this.#hours}h${this.#minutes}`, true)
			embed.addField(`Places restantes:`,`9`, true)
			embed.setImage(`https://i.imgur.com/8sd2fgo.png`)
			embed.setFooter(`Réagissez en dessous pour participer`)
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

		try {
			//try adding role to players
			let player = this.#guild.members.cache.find(r => r.id === this.#author.id)
			player.roles.add(this.#role)
		} catch (error) {
			sendThenDelete(this.#channel, 'missing permission to add role.')
			.then(console.log(error))
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

	// getHours() {
	// 	return this.#hours
	// }

	// getMinutes() {
	// 	return this.#minutes
	// }

	getEmoji() {
		return Game.#EMOJI
	}
}

module.exports = {
	Game
}