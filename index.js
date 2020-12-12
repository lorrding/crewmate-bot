const { readdirSync } = require("fs")
const { join } = require("path")

const {Client, Collection } = require("discord.js")

const { prefix } = require("./config.json")
const { sendThenDelete, inDev, showDate, getReaction } = require('./toolbox')
const { dev } = require('./commands/dev')

const client = new Client({ partials: ['REACTION']})
client.login(process.env.BOT_TOKEN).then(() => {})
client.commands = new Collection()
client.messageReactions = new Collection()
client.queue = new Map()
client.prefix = prefix


// importing commands
const commands = readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"))
console.log("loading commands...")
for (const file of commands) {
	const command = require(join(__dirname, "commands", `${file}`))
	client.commands.set(command.name, command)
}
console.log(`loaded ${commands.length} commands\n`)

// importing messageReactions
const messageReactions = readdirSync(join(__dirname, "messageReactions")).filter((file) => file.endsWith(".js"))
console.log("loading messageReactions...")
for (const file of messageReactions) {
	const reaction = require(join(__dirname, "messageReactions", `${file}`))
	client.messageReactions.set(reaction.id, reaction)
}
console.log(`loaded ${messageReactions.length} reactions`)



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
				channel.send(`Reboot done at ${showDate(date, true)}`)
			})
			.catch(console.error)
	}
})


client.on("warn", (info) => console.log(info))



client.on("error", (e) =>  console.error(e))



client.on('message', async message => {
	if (message.author.bot) return
	if (!message.content.startsWith(message.client.prefix)) return

	const args = message.content.slice(message.client.prefix.length).trim().split(/ +/g)
	const command = args.shift().toLowerCase()
	if (dev && command !== "dev") return inDev(message.channel)

	const commandToExec = client.commands.get(command) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(command))

	if (!commandToExec) return console.log(`did not found ${command}`)

	console.log(`\nCommand ${command} by ${message.author.username}#${message.author.discriminator} in '${message.guild}' at ${showDate(message.createdAt)}`)
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
	if (user.bot) return

	const emittedReaction = getReaction(reaction)
	console.log(`\nReaction ${emittedReaction.emoji.name} added by ${user.username}#${user.discriminator} in '${emittedReaction.message.guild}' at ${showDate(emittedReaction.message.createdAt)}`)


	const reactionToExec = client.messageReactions.get(emittedReaction.emoji.id)

	if (!reactionToExec) return console.log(`did not found ${emittedReaction.emoji.name} (id:${emittedReaction.emoji.id})`)

	try {
		reactionToExec.execute(emittedReaction, user, "add")
	} catch (e) {
		console.error(e)
		return sendThenDelete(emittedReaction.message.channel, `${e}`)
	}
})



client.on('messageReactionRemove', async (reaction, user) => {
	if (dev) return inDev(reaction.message.channel)
	//if bot, then don't
	if (user.bot) return

	const emittedReaction = getReaction(reaction)
	console.log(`\nReaction ${emittedReaction.emoji.name} removed by ${user.username}#${user.discriminator} in '${emittedReaction.message.guild}' at ${showDate(emittedReaction.message.createdAt)}`)


	const reactionToExec = client.messageReactions.get(emittedReaction.emoji.id)

	if (!reactionToExec) return console.log(`did not found ${emittedReaction.emoji.name} (id:${emittedReaction.emoji.id})`)

	try {
		reactionToExec.execute(emittedReaction, user, "remove")
	} catch (e) {
		console.error(e)
		return sendThenDelete(emittedReaction.message.channel, `${e}`)
	}
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