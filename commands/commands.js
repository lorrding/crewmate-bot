const config = require('../config.json')
const { sendThenDelete } = require('../toolbox')
const { MessageEmbed } = require('discord.js')
const { voice } = require('../commands/voice/music')
const { help } = require('../commands/help/help')

module.exports = {
	manageMessage
}

function manageMessage(message, command, args, client, gameManager) {
	// formatting message
	console.log(`\nCommand ${command} by ${message.author.username}#${message.author.discriminator} in '${message.guild}' at ${message.createdAt}`)
	if (args.length) console.log(`With args ${args}`)

	// switch between every know commands
	switch (command) {
		case "ping":
			return ping(message)
		case "say":
			return say(message)
		case "addme":
			return addme(message)
		case "purge":
			return purge(message, message.channel, args)
		case "uptime":
			return uptime(message)
		case "help":
			return helpFunc(message, args)
		case "play": case "pause": case "stop": case "rr":
			return voice(message, command, args, client)
		case "game": case "g":
			return gameFunc(message, args, gameManager)
		default:
			return sendThenDelete(message.channel, "Commande inconnu")
	}
}

async function ping(message) {
	try {
		let embed = new MessageEmbed()
			.setColor('#FFFFFF')
		const m = await message.channel.send("Ping?")
		embed.setAuthor(`${message.author.username} -> ping`, `${message.author.avatarURL()}`)
		embed.addField(`Pong! (${m.createdTimestamp - message.createdTimestamp}ms).`,`Latence API: ${Math.round(message.client.ws.ping)}ms.`)
		m.delete()
		return sendThenDelete(message.channel, embed, 10000).then(() => message.delete())
	} catch (e) {
		return sendThenDelete(message.channel, `${e}`)
	}
}

function say(message) {
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

async function addme(message) {
	try {
		message.author.createDM().then(DMChannel => DMChannel.send("https://discord.com/oauth2/authorize?client_id=767802286550155296&permissions=486464&scope=bot"))
		await message.delete()
	} catch (e) {
		return console.log(`${e}`)
	}
}

async function purge(message, channel, args) {
	try {
		if (message.member.hasPermission('ADMINISTRATOR') || message.author.id === "224230450099519488" ) {
			console.log('200, authorised..')
			switch (args[0]) {
				case "-all": case "all": case "a":
					if (parseInt(args[1]) <= 0 || parseInt(args[1]) >= 100) return sendThenDelete(channel, "le nombre de message à supprimer doit être entre 1 et 99")
					try {
						console.log(`starting deletion of ${args[1]} messages..`)
						const fetched = await channel.messages.fetch({limit: parseInt(args[1])})
						fetched.forEach(fetchedMessage => {
							if (fetchedMessage.deletable) fetchedMessage.delete()
						})
					} catch (e) {
						return sendThenDelete(channel, `${e}`)
					}
					break
				case "-bulk": case "bulk": case "b":
					try {
						console.log(`bulk deleting message that are less than 2 weeks old..`)
						await channel.bulkDelete(await channel.messages.fetch({limit: 99}), true)
					} catch (e) {
						return sendThenDelete(channel, `${e}`)
					}
					break
				default :
					sendThenDelete(channel, "Argument invalide")
					return message.delete()
			}
		} else {
			sendThenDelete(channel, "403, forbidden command.")
			return message.delete()
		}
	} catch (e) {
		return sendThenDelete(channel, `${e}`)
	}
}

function uptime(message) {
	let seconds = Math.floor(message.client.uptime / 1000)
	let minutes = Math.floor(seconds / 60)
	let hours = Math.floor(minutes / 60)
	let days = Math.floor(hours / 24)

	seconds %= 60
	minutes %= 60
	hours %= 24

	return sendThenDelete(message.channel, new MessageEmbed()
		.setColor('#00FFFF')
		.setAuthor(`${message.author.username} -> uptime`, `${message.author.avatarURL()}`)
		.addField(`Current uptime:`,`${days} day(s), ${hours} hours, ${minutes} minutes, ${seconds} seconds`), 30000
		).then(() => message.delete())
}

async function helpFunc(message, args) {
	try {
		message.author.createDM().then(DMChannel => DMChannel.send(help(args[0])))
	} catch (e) {
		return sendThenDelete(message.channel, `${e}`)
	}
	if (message.channel.type !== "dm") {
		try {
			await message.delete()
		} catch (e) {
			return sendThenDelete(message.channel, `${e}`)
		}
	}
}

async function gameFunc(message, args, gameManager) {
	if (!args.length) {
		sendThenDelete(message.channel, "Arguments manquant!\n /game -help pour plus d'infos")
		return message.delete()
	}
	let arg = args[0]

	switch (arg) {
		case "-add": case "-a": case "a":
			// création d'une partie
			args.shift()
			return gameManager.addGame(message, args)
		case "-delete": case "-d": case "d":
			//suppression d'un partie en court
			return gameManager.deleteGame(message)
		case "-help": case "-h": case "h":
			//help
			try {
				message.author.createDM().then(DMChannel => DMChannel.send(help("-g")))
			} catch (e) {
				return sendThenDelete(message.channel, `${e}`)
			}
			if (message.channel.type !== "dm") {
				try {
					await message.delete()
				} catch (e) {
					return sendThenDelete(message.channel, `${e}`)
				}
			}
			break
		case "-dump":
			if (message.member.hasPermission('ADMINISTRATOR') || message.author.id === "224230450099519488") {
				//dump var
				sendThenDelete(message.channel, gameManager.dumpVars(),30000)
				return message.delete()
			}
			break
		default:
			let channel = message.channel
			try {
				sendThenDelete(channel, `argument invalide ou non détecté!\n tapez '*/game -help*' pour plus d'info...`)
				console.log('no arguments found for /game')
				return message.delete()
			} catch (error) {
				sendThenDelete(channel, 'Error deleting message.')
					.then(console.log(error))
			}
			break
	}
}