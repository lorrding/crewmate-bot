const { readdirSync } = require("fs")
const { join } = require("path")

const {Client, Collection } = require("discord.js")

const { prefix, intents } = require("./config.json")
const { sendThenDelete, inDev, showDate, getReaction, getPrefix } = require('./toolbox')
const { dev } = require('./commands/dev')
const {fetchAll} = require('./database')


const client = new Client({ intents: JSON.parse(JSON.stringify(intents)), partials: ['REACTION']})
client.login(process.env.BOT_TOKEN).then(() => {})
client.commands = new Collection()
client.messageReactions = new Collection()
client.queue = new Map()
client.prefix = prefix
client.dev = false
client.botGuilds = new Collection()
client.interactions = new Collection()


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
		client.botGuilds.set(guild.id, guild)
	}
	console.log('data loaded\n')
})

// importing interactions
const interactionsFiles = readdirSync('./interactions').filter(file => file.endsWith('.js'))
console.log("loading interactions...")
for (const file of interactionsFiles) {
	const interaction = require(`./interactions/${file}`)
	client.interactions.set(interaction.data.name, interaction)
}
console.log(`loaded ${interactionsFiles.length} interactions\n`)


// importing events
const eventFiles = readdirSync('./events').filter(file => file.endsWith('.js'))
console.log("loading events...")
for (const file of eventFiles) {
	const event = require(`./events/${file}`)
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args))
	} else {
		client.on(event.name, (...args) => event.execute(...args))
	}
}
console.log(`loaded ${eventFiles.length} events\n`)



// handle uncatched errors
process.on('unhandledRejection', (reason, p) => {
	console.error('Unhandled Rejection reason:', reason)
})