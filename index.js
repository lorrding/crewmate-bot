const Discord = require('discord.js')
// const cron = require('node-cron')

const connect = require("./connect")

const config = require("./config.json")

const GameManager = require('./GameManager')
const { sendThenDelete} = require('./toolbox')

const client = new Discord.Client()
const gameManager = new GameManager.GameManager()
let dev = false

client.on('ready',async () => {
	console.log(`logged in as ${client.user.tag}, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} server.`)
	await client.user.setActivity("Among Us", {
		type: "STREAMING",
		url: "https://youtu.be/dQw4w9WgXcQ"
	})
})

client.on('message', async message => {
	
	if (!message.content.startsWith(config.prefix) || message.author.bot) return
	const args = message.content.slice(config.prefix.length).trim().split(/ +/g)
	const command = args.shift().toLowerCase()
	console.log(`Command ${command} by ${message.author.username}#${message.author.discriminator} in '${message.guild}' at ${message.createdAt}`)
	if (args.length) console.log(`With args ${args}`)

// activate/deactivate for dev
	if (command === "dev" && message.author.id === "224230450099519488") {
		if (dev) {
			dev = false
			sendThenDelete(message.channel, `retour en mode normal.`)
		} else {
			dev = true
			sendThenDelete(message.channel, `Ok, passage en dev mode.`)
		}
	}
	if (dev) return console.log('MODE DEV, ignoring...')

// game
	if (command === "game" || command === "g") {
		if (!args.length) return sendThenDelete(message.channel, "Arguments manquant!\n-a ou --add suivi de l'heure pour ajouter une game\n-d | --delete -> suppression de la game en court```")

		args.forEach(function(element) {

			// création d'une partie
			if (element === "-add" || element === "-a") {
				args.shift()
				return gameManager.addGame(message, args)
			}

			//suppression d'un partie en court
			if (element === "-delete" || element === "-d") {
				return gameManager.deleteGame(message)
			}

			//help
			if ( element === "-help" || element === "-h") {
				// return help("game")
			}

			let channel = message.channel
			try {
				sendThenDelete(channel, `argument invalide ou non détecté!\n tapez '*/game -help*' pour plus d'info...`)
				console.log('no arguments found for /game')
				return message.delete()
			} catch (error) {
				sendThenDelete(channel, 'Error deleting message.')
					.then(console.log(error))
			}
		})
	}

// ping
	if (command === "ping") {
		try {
			let embed = new Discord.MessageEmbed()
			embed.setColor('#FFFFFF')
			const m = await message.channel.send("Ping?")
			embed.setAuthor(`${message.author.username} -> ping`, `${message.author.displayAvatarURL}`)
			embed.addField(`Pong! (${m.createdTimestamp - message.createdTimestamp}ms).`,`Latence API: ${Math.round(client.ping)}ms.`)
			await message.delete()
			m.delete()
			await message.channel.send(embed)
		} catch (e) {
			return sendThenDelete(message.channel, `${e}`)
		}
	}

// help
	if (command === "help") {
		try {
			await message.channel.send("Soon..")
		} catch (e) {
			return sendThenDelete(message.channel, `${e}`)
		}
	}

// say 
	if (command === "say") {
		try {
			message.delete().catch(()=>{})
			if (message.mentions.users.size) {
				message.mentions.users.map(user => {
					return `${user.id}`
				})
				message.channel.send(`${message.content.slice(config.prefix.length+4)}`).catch(()=>{message.channel.send("Rien à raconter...")})
			} else {
				message.channel.send(`${message.content.slice(config.prefix.length+4)}`).catch(()=>{message.channel.send("Rien à raconter...")})
			}
		} catch (e) {
			return sendThenDelete(message.channel, `${e}`)
		}
	}

// addMe
	if (command === "addme") {
		try {
			message.author.createDM().then(DMChannel => DMChannel.send("https://discord.com/oauth2/authorize?client_id=767802286550155296&permissions=486464&scope=bot"))
			await message.delete()
		} catch (e) {
			return console.log(`${e}`)
		}
	}
})

client.on('messageReactionAdd', async (reaction, user) => {
	if (dev) {
		return console.log('MODE DEV, ignoring...')
	}
	if (reaction.partial) {
		try {
			reaction = await reaction.fetch()
		} catch (error) {
			return console.log(`Something went wrong when fetching the message: ${error}`)
		}
	}

	//if bot, then don't
	if (user.bot) return 0

	//calling gameManager to check everything else...
	await gameManager.manageAddReaction(reaction, user)
})

client.on('messageReactionRemove', async (reaction, user) => {
	if (dev) {
		return console.log('MODE DEV, ignoring...')
	}
	if (reaction.partial) {
		try {
			reaction = await reaction.fetch()
		} catch (error) {
			console.error('Something went wrong when fetching the message: ', error)
			return
		}
	}

	if (user.bot) return 0

	//calling gameManager to check everything else...
	await gameManager.manageRemoveReaction(reaction, user)
})

connect.login(client)