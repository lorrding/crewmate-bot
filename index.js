const {play} = require("./toolbox");
const { readdirSync } = require("fs")
const { join } = require("path")

const {Client, Collection } = require("discord.js")

const { prefix } = require("./config.json")
const { sendThenDelete, inDev } = require('./toolbox')
const { dev } = require('./commands/dev')

const client = new Client({ partials: ['REACTION']})
client.login(process.env.BOT_TOKEN).then(() => {})
client.commands = new Collection()
client.queue = new Map()
client.prefix = prefix

const { gameManager } = require('./commands/game')

client.on('ready',async () => {
	console.log(`\nlogged in as ${client.user.tag}, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} server.`)
	await client.user.setActivity("Among Us", {
		type: "STREAMING",
		url: "https://youtu.be/dQw4w9WgXcQ"
	})
	if (client.user.username === "Crewmate-bot") {
		client.channels.fetch('767812168745484328')
			.then(channel => {
				let date = new Date()
				channel.send(`Reboot done at ${date.getUTCHours()+1}h${date.getUTCMinutes()} ${date.getUTCDate()}/${date.getUTCMonth()+1}/${date.getUTCFullYear()}`)
			})
			.catch(console.error)
	}
})


client.on("warn", (info) => console.log(info))

client.on("error", (e) =>  console.error(e))


// importing commands
const commands = readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"))
console.log("loading commands...")
for (const file of commands) {
	const command = require(join(__dirname, "commands", `${file}`))
	client.commands.set(command.name, command)
}
console.log(`loaded ${commands.length} commands`)



// message event
client.on('message', async message => {
	if (message.author.bot) return
	if (!message.content.startsWith(message.client.prefix)) return

	const args = message.content.slice(message.client.prefix.length).trim().split(/ +/g)
	const command = args.shift().toLowerCase()
	if (dev && command !== "dev") return inDev(message.channel)

	const commandToExec = client.commands.get(command) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(command))

	if (!commandToExec) return console.log(`did not found ${command}`)

	console.log(`\nCommand ${command} by ${message.author.username}#${message.author.discriminator} in '${message.guild}' at ${message.createdAt}`)
	if (args.length) console.log(`With args ${args}`)

	try {
		commandToExec.execute(message, args, command)
	} catch (e) {
		console.error(e)
		return sendThenDelete(message.channel, `${e}`)
	}
})

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

// client.on('voiceStateUpdate', (oldStat, newState) => {
// 	if (!client.voice.connections.some(aConnection => aConnection.channel.id === oldStat.channelID)) return
// 	let connection = client.voice.connections.find(aConnection => aConnection.channel.id === oldStat.channelID)
//
// 	console.log(connection.channel.members.size)
// 	if (connection == undefined) return
// 	if (connection.channel.members.size < 2) client.setTimeout( disconnect(),60000 ,connection)
// 	console.log("bot is the only member in the voice channel, disconnecting in 60 secondes...")
// })


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