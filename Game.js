const Discord = require('discord.js')
const { sendThenDelete, formatEmbedTime, formatListPlayers, getHexa } = require('./toolbox')

class Game {

	#guild //guild the game is scheduled
	#channel //channel the game is scheduled
	#role //role to manage players
	#message = new Discord.Message(undefined, undefined, undefined) // embed that represent the game
	#author //= new Discord.User(new Discord.Client(), undefined) // author of the game
	#listPlayers = [] // list of all players, excluding author
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
		//if wrong message, then don't
		if (reaction.message.id !== this.#message.id) return 0

		//if wrong reaction, then don't
		if (reaction.emoji.id !== Game.#EMOJI) return 0

		// if author of game, then don't
		console.log('author: '+this.getAuthor());
		if(member.id === this.#author.id) {
			try {
				reaction.users.remove(member).then(() => {})
			} catch (error) {
				return sendThenDelete(this.#channel, 'missing permission to remove reaction.')
				.then(console.log(error))
			}
			sendThenDelete(this.#channel, "La personne qui propose de jouer est déjà dans la liste des joueurs, pas besoin de réagir au message!")
			return console.log('(from gObject) Author already un list, ignoring...')
		}

		//if already 10 players, then don't
		if (this.#listPlayers.length >= 10) {
			try {
				reaction.users.remove(member).then(() => {})
			} catch (error) {
				return sendThenDelete(this.#channel, 'missing permission to remove reaction.')
				.then(console.log(error))
			}
			sendThenDelete(this.#channel, "Nombre de joueurs max atteint!")
			sendThenDelete(this.#channel, "<:AU_why:765273043962298410>")
			console.log('Max players reached!');
		}

		//checking if user isn't already in list of players
		if (this.#listPlayers.length > 0 && this.#listPlayers.find(user => user === user.username)) {
			try {
				reaction.user.remove()
			} catch (error) {
				return sendThenDelete(this.#channel, 'missing permission to remove reaction.')
				.then(console.log(error))
			}
			sendThenDelete(this.#channel ,5000, "Vous êtes déjà dans la liste des joueurs! (mais nous n'êtes même pas censé voir cette erreur)")
			return console.log('user already un list, ignoring...')
		}

		//everything's ok
		try {
			// try adding user in list of players
			console.log(`Adding user ${member.username}...`)
			this.#listPlayers.push(`${member.username}`)
			// editEmbed(reaction.message)
		} catch (error) {
			return sendThenDelete(this.#channel, `Erreur, impossible d'ajouter le jouer à la liste des participants.`)
			.then(console.log(error))
		}

		try {
			//try adding role to player
			let player = this.#guild.members.find(r => r.id === member.id)
			player.roles.add(this.#role)
		} catch (error) {
			return sendThenDelete(this.#channel, 'missing permission to add role.')
			.then(console.log(error))
		}

		//everything's good
		this.editEmbed()
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
			throw sendThenDelete(this.#channel, "Erreur lors de la création de l'embed.")
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
			sendThenDelete(this.#channel, "Error copying embed.")
				.then(console.log(error))
		}

		//try updating fields
		try {
			embed.addField(`${formatEmbedTime(this.#hours, this.#minutes)} à:`,`${this.#hours}h${this.#minutes}`, true)

			if (this.#listPlayers.length) {
				embed.setDescription(`avec: ${formatListPlayers(this.#listPlayers)}`)
				// let Nbplayers = 9 - this.#listPlayers.length;
				embed.addField(`Places restantes:`,`${9 - this.#listPlayers.length}`, true)
			} else {
				embed.setDescription(``)
				embed.addField(`Places restantes:`,`9`, true)
			}
		} catch (error) {
			sendThenDelete(this.#channel, "Error updating fields.")
				.then(console.log(error))
		}

		//try sending embed
		try {
			this.#channel.send(embed)
				//adding reaction
				.then(embedMessage => {
					embedMessage.react(Game.#EMOJI).then(() => {})
					this.#message = embedMessage
				})
		} catch (error) {
			sendThenDelete(this.#channel, "missing permissions to send embed or react.")
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

	getRole() {
		return this.#role
	}

	// getChannel() {
	// 	return this.#channel
	// }

	getMessage() {
		return this.#message
	}

	getAuthor() {
		return this.#author
	}

	// getListPlayers() {
	// 	return this.#listPlayers
	// }
	//
	// getHours() {
	// 	return this.#hours
	// }
	//
	// getMinutes() {
	// 	return this.#minutes
	// }

	static getEmoji() {
		return Game.#EMOJI
	}
}

module.exports = {
	Game
}