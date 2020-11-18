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
	client.channels.fetch('767812168745484328')
		.then(channel => {
			let date = new Date()
			channel.send(`Reboot done at ${date.getUTCHours()+1}h${date.getUTCMinutes()} ${date.getUTCDate()}/${date.getUTCMonth()}/${date.getUTCFullYear()}`)
		})
		.catch(console.error);
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
		await message.delete()
	}
	if (dev && message.channel.id === "767812168745484328") return console.log('MODE DEV, ignoring...')

// game
	if (command === "game" || command === "g") {
		if (!args.length) {
			sendThenDelete(message.channel, "Arguments manquant!\n-a ou --add suivi de l'heure pour ajouter une game\n-d | --delete -> suppression de la game en court```")
			return message.delete()
		}

		let element = args[0]

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
			sendThenDelete(message.channel, "soon..")
			return message.delete()
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
	}

// ping
	if (command === "ping") {
		try {
			let embed = new Discord.MessageEmbed()
				.setColor('#FFFFFF')
				const m = await message.channel.send("Ping?")
				embed.setAuthor(`${message.author.username} -> ping`, `${message.author.avatarURL()}`)
				embed.addField(`Pong! (${m.createdTimestamp - message.createdTimestamp}ms).`,`Latence API: ${Math.round(client.ws.ping)}ms.`)
				m.delete()
				return sendThenDelete(message.channel, embed, 10000).then(() => message.delete())
		} catch (e) {
			return sendThenDelete(message.channel, `${e}`)
		}
	}

// uptime
if (command === "uptime") {
	try {
		let embed = new Discord.MessageEmbed()
			.setColor('#00FFFF')
			.setAuthor(`${message.author.username} -> uptime`, `${message.author.avatarURL()}`)
			.addField(`Current uptime:`,`${client.uptime} ms (${Math.round(client.uptime/3600000)} hours).`)
		return sendThenDelete(message.channel, embed, 30000).then(() => message.delete())
	} catch (e) {
		return sendThenDelete(message.channel, `${e}`)
	}
}

// help
	if (command === "help") {
		try {
			return sendThenDelete(message.channel, "Soon..").then(() => message.delete())
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

// purge message
	if (command === "purge") {
		let channel = message.channel
		try {
			if (message.member.hasPermission('ADMINISTRATOR') || message.author.id === "224230450099519488" ) {
				console.log('200, authorised..')
				async function clear(channel) {
					try {
						const fetched = await channel.messages.fetch({limit: 99})
						await channel.bulkDelete(fetched)
					} catch (e) {
						return sendThenDelete(channel, `${e}`)
					}
				}
				await clear(channel)
			} else sendThenDelete(channel, "Error 403, forbidden command.")
			return message.delete()
		} catch (e) {
			return sendThenDelete(channel, `${e}`)
		}
	}
})

client.on('messageReactionAdd', async (reaction, user) => {
	if (dev && reaction.message.channel.id === "767812168745484328") {
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
	if (dev && reaction.message.channel.id === "767812168745484328") {
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

client.on('guildMemberAdd', member => {
	console.log("new user detected!")
	let channel = member.guild.channels.cache.find(ch => ch.name === 'member-log')
	if (!channel) return console.log("cannot find channel")
	channel.send(`Bienvenue sur le serveur ${member}\nPense à aller voir les <#764910769132929048>. Le code pour rejoindre les parties est dans <#764910769132929049>`)
})

connect.login(client)