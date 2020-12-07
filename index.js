const Discord = require('discord.js')

const connect = require("./connect")

const config = require("./config.json")

const GameManager = require('./GameManager')
const { sendThenDelete, help, play, deleteMessage} = require('./toolbox')

const client = new Discord.Client({ partials: ['REACTION']})
const gameManager = new GameManager.GameManager()
let dev = false

let dispatcher

client.on('ready',async () => {
	console.log(`logged in as ${client.user.tag}, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} server.`)
	await client.user.setActivity("Among Us", {
		type: "STREAMING",
		url: "https://youtu.be/dQw4w9WgXcQ"
	})
	client.channels.fetch('767812168745484328')
		.then(channel => {
			let date = new Date()
			channel.send(`Reboot done at ${date.getUTCHours()+1}h${date.getUTCMinutes()} ${date.getUTCDate()}/${date.getUTCMonth()+1}/${date.getUTCFullYear()}`)
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
	if (dev) return console.log('MODE DEV, ignoring...')

// game
	if (command === "game" || command === "g") {
		if (!args.length) {
			sendThenDelete(message.channel, "Arguments manquant!\n /game -help pour plus d'infos")
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
			return 0;
		}

		//dump var
		if ((element === "-dump" || element === "-dmp") && (message.member.hasPermission('ADMINISTRATOR') || message.author.id === "224230450099519488")) {
			sendThenDelete(message.channel, gameManager.dumpVars(),30000)
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
	if (command === "help" || command === "h") {
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
				console.log(args[0])

				switch (args[0]) {
					case "-all":
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
					case "-bulk":
						try {
							console.log(`bulk deleting message that are less than 2 weeks old..`)
							const fetched = await channel.messages.fetch({limit: 99})
							channel.bulkDelete(fetched, true)
						} catch (e) {
							return sendThenDelete(channel, `${e}`)
						}
						break
				}
			} else {
				sendThenDelete(channel, "403, forbidden command.")
				return message.delete()
			}
		} catch (e) {
			return sendThenDelete(channel, `${e}`)
		}
	}

// voice
	if (command === "play") {
		// checking if the message come from a guild
		if (!message.guild) return

		if (message.member.voice.channel && message.member.voice.channel.joinable) {
			// playing lofi
			let url = args[0]
			const connection = await message.member.voice.channel.join()

			switch (url) {
				case "lofi": case "-lofi":
					dispatcher = await play(connection, message, 'https://www.youtube.com/watch?v=5qap5aO4i9A')
					break;
				case "-help": case "-h":
					//help
					try {
						message.author.createDM().then(DMChannel => DMChannel.send(help("-p")))
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
					break;
				default:
					dispatcher = await play(connection, message, url)
					break;
			}
		} else {
			sendThenDelete(message.channel, "Vous n'êtes dans aucun channel vocal que je peux rejoindre!")
		}
		// deleteMessage(client, message)
	}

// rr
	if (command === "rr") {
		// checking if the message come from a guild
		if (!message.guild) return
		if (message.member.voice.channel && message.member.voice.channel.joinable) {
			const connection = await message.member.voice.channel.join()
			dispatcher = await play(connection, message, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ')
		} else {
			sendThenDelete(message.channel, "Cannot rickRoll here")
		}
		// deleteMessage(client, message)
	}
})

// client.on('voiceStateUpdate', (oldStat, newState) => {
// 	if (!client.voice.connections.some(aConnection => aConnection.channel.id === oldStat.channelID)) return
// 	let connection = client.voice.connections.find(aConnection => aConnection.channel.id === oldStat.channelID)
//
// 	console.log(connection.channel.members.size)
// 	if (connection == undefined) return
// 	if (connection.channel.members.size < 2) client.setTimeout( disconnect(),60000 ,connection)
// 	console.log("bot is the only member in the voice channel, disconnecting in 60 secondes...")
// })

client.on('messageReactionAdd', async (reaction, user) => {
	if (dev) {
		return console.log('MODE DEV, ignoring...')
	}
	//if bot, then don't
	if (user.bot) return 0

	if (reaction.partial) {
		console.log('partial reaction. Fetching...')
		reaction.fetch()
			.then(fullReaction => {
				//calling gameManager to check everything else...
				gameManager.manageAddReaction(fullReaction, user)
			})
			.catch(e => {
				console.log('Something went wrong when fetching the reaction: ', e);
			})
	} else {
		console.log('The reaction is not partial.')
		//calling gameManager to check everything else...
		await gameManager.manageAddReaction(reaction, user)
	}
})

client.on('messageReactionRemove', async (reaction, user) => {
	if (dev) {
		return console.log('MODE DEV, ignoring...')
	}

	if (user.bot) return 0

	if (reaction.partial) {
		console.log('partial reaction. Fetching...')
		reaction.fetch()
			.then(fullReaction => {
				//calling gameManager to check everything else...
				return gameManager.manageRemoveReaction(fullReaction, user)
			})
			.catch(e => {
				console.log('Something went wrong when fetching the reaction: ', e);
			})
	} else {
		console.log('The reaction is not partial.')
		//calling gameManager to check everything else...
		await gameManager.manageRemoveReaction(reaction, user)
	}
	return 0
})

client.on('guildMemberAdd', member => {
	console.log("new user detected!")
	try {
		let channel = member.guild.channels.cache.find(ch => ch.name === 'les-nouveaux')
		if (!channel) return console.log("cannot find channel")
		channel.send(`Bienvenue sur le serveur ${member}\nPense à aller voir les <#764910769132929048>. Les codes pour rejoindre les parties sont postés dans <#764910769132929049>`)
	} catch (e) {
		return console.log(e)
	}
})

// dispatcher.on('start', () => {
// 	console.log('crewmate bot is now playing audio!');
// });
//
// dispatcher.on('finish', () => {
// 	console.log('song finished!');
//
// });
//
// // Always remember to handle errors appropriately!
// dispatcher.on('error', console.error);

connect.login(client)