const {getPrefix, inDev, showDate, sendThenDelete} = require("../toolbox");
module.exports = {
	name: 'messageCreate',
	async execute(message) {
		if (message.author.bot) return

		const prefix = getPrefix(message)
		if (!message.content.startsWith(prefix)) return

		const args = message.content.slice(prefix.length).trim().split(/ +/g)
		const command = args.shift().toLowerCase()
		if (message.client.dev && command !== "dev") return inDev(message)

		const commandToExec = message.client.commands.get(command) || message.client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(command))

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
	}
}