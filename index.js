const { readdirSync } = require("fs")
const { join } = require("path")

const {Client, Collection } = require("discord.js")

const { prefix } = require("./config.json")
const { sendThenDelete, inDev, showDate, getReaction, getPrefix } = require('./toolbox')
const { dev } = require('./commands/dev')
const { GameManager } = require('./Games/GameManager')
const {fetchAll} = require('./database')


const client = new Client({ partials: ['REACTION']})
client.login(process.env.BOT_TOKEN).then(() => {})
client.commands = new Collection()
client.messageReactions = new Collection()
client.queue = new Map()
client.prefix = prefix
client.dev = false
client.botGuilds = new Collection()

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
console.log(`loaded ${messageReactions.length} reactions\n`)

// importing every known guilds
console.log('fetching data..')
fetchAll(function (data) {
	console.log('data fetched')
	for (let guild of data) {
		client.botGuilds.set(guild.guild_id, guild)
	}
	console.log('data loaded\n')
})



client.on('ready',async () => {
	let CDJChannel = client.channels.cache.find(channel => channel.id === '764910769132929049')
	client.gameManager = new GameManager(CDJChannel, client.commands.get("purge"))
	if (client.botGuilds) {
		client.gameManager.restoreDB(client)
	} else {
		console.log("error, data not ready")
		console.log(client.botGuilds)
	}
	console.log(`logged in as ${client.user.tag}, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} server.`)
	await client.user.setActivity("Among Us", {
		type: "STREAMING",
		url: "https://youtu.be/dQw4w9WgXcQ"
	})
})


client.on("warn", (info) => console.log(info))



client.on("error", (e) =>  console.error(e))



client.on('message', async message => {
	if (message.author.bot) return

	const prefix = getPrefix(message)
	if (!message.content.startsWith(prefix)) return

	const args = message.content.slice(prefix.length).trim().split(/ +/g)
	const command = args.shift().toLowerCase()
	if (message.client.dev && command !== "dev") return inDev(message)

	const commandToExec = client.commands.get(command) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(command))

	if (!commandToExec) return console.log(`did not found ${command}`)

	if (message.channel.type === 'text') {
		console.log(`\nCommand ${command} by ${message.author.username}#${message.author.discriminator} in '${message.guild.name}' at ${showDate(message.createdAt)}`)
	} else {
		console.log(`\nCommand ${command} by ${message.author.username}#${message.author.discriminator} in Private Message at ${showDate(message.createdAt)}`)
	}

	if (args.length) console.log(`With args ${args}`)

	try {
		commandToExec.execute(message, args, command)
	} catch (e) {
		console.error(e)
		return sendThenDelete(message.channel, `${e}`)
	}

	if (message.channel.type === 'text') {
		if (message && message.guild.me.hasPermission("MANAGE_MESSAGES")) {
			try {
				await message.delete()
			} catch (e) {
				return sendThenDelete(console.error(e))
			}
		}
	}
})



client.on('messageReactionAdd', async (reaction, user) => {
	if (dev) return inDev(reaction.message.channel)
	//if bot, then don't
	if (user.bot) return

	const emittedReaction = getReaction(reaction)
	console.log(`\nReaction ${emittedReaction.emoji.name} added by ${user.username}#${user.discriminator} in '${emittedReaction.message.guild.name}' at ${showDate(emittedReaction.message.createdAt)}`)


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
	console.log(`\nReaction ${emittedReaction.emoji.name} removed by ${user.username}#${user.discriminator} in '${emittedReaction.message.guild.name}' at ${showDate(emittedReaction.message.createdAt)}`)


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
		if (member.guild.systemChannel) {
			const channel = member.guild.systemChannel
			return channel.send(`Bienvenue sur le serveur ${member}\nPense à aller voir les <#764910769132929048>. Les codes pour rejoindre les parties sont postés dans <#764910769132929049>`)
		} else return console.log("cannot find channel")
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