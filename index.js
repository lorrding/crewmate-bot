const Discord = require('discord.js')
const cron = require('node-cron')

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
	
	// const minigames = require('./minigames.js')
	// let channel = client.channels.cache.get('772570387208208424')
	// minigames.CacheCache(channel)
	// minigames.SlenderMan(channel)
	// minigames.PieceSecu(channel)
	// minigames.ChambreSecu2(channel)
	// minigames.CoursPoursuite(channel)
	// minigames.Protips(channel)
})

// let task = cron.schedule(`* * * * *`, () => {
// 	if (gameScheduled) {
// 		let d = new Date()
// 		let h = d.getUTCHours() + 2
// 		let m = d.getMinutes()
// 		if (h === heures && m === minutes) {
// 			pingMsg = gameMessage.channel.send(`<@&767870145091600405>, c'est l'heure de jouer!\n Venez dans le vocal et rejoignez la game`)
// 			console.log('NOW!!!!!!')
// 			console.log('game is launched, deleting game object')
// 			return setTimeout(() => {  deleteGame() }, 1000)
// 		}
// 	}
// }, {
// 	scheduled: false,
// 	timezone: "Europe/Paris"
// })
// //cron schedule
// try {
// } catch (error) {
// 	let date_ob = new Date()
// 	// let date = ("0" + date_ob.getDate()).slice(-2)
// 	let hours = date_ob.getHours()
// 	let minutes = date_ob.getMinutes()
// 	console.log(`error at ${hours}:${minutes} \n${error}`)
// }

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
			if (element === "-a" || element === "-add" || element === "-h") {
				args.shift()
				return gameManager.addGame(message, args)
			}

			//suppression d'un partie en court
			if (element === "-d" || element === "-delete") {
				return gameManager.deleteGame(message)
			}

			let channel = message.channel
			try {
				sendThenDelete(channel, `argument invalide ou non détecté!`)
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