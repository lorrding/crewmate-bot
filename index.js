const Discord = require('discord.js')
const connect = require("./connect")
const config = require("./config.json")
const { sendThenDelete, inDev } = require('./toolbox')
const { manageMessage } = require("./commands/commands")
const { GameManager } = require('./GameManager')

const client = new Discord.Client({ partials: ['REACTION']})
const gameManager = new GameManager()

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
			channel.send(`Reboot done at ${date.getUTCHours()+1}h${date.getUTCMinutes()} ${date.getUTCDate()}/${date.getUTCMonth()+1}/${date.getUTCFullYear()}`)
		})
		.catch(console.error);
})

client.on('message', async message => {
	if (!message.content.startsWith(config.prefix) || message.author.bot) return
	const args = message.content.slice(config.prefix.length).trim().split(/ +/g)
	const command = args.shift().toLowerCase()

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
	if (dev) return inDev(message.channel)

	return manageMessage(message, command, args, client, gameManager)
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
	if (dev) return inDev(reaction.message.channel)
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
	if (dev) return inDev(reaction.message.channel)

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