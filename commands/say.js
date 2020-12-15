module.exports = {
	name: "say",
	aliases: ["repeat"],
	description: "Let the bot speak",
	execute(message, args, command) {
		message.delete()
		message.channel.send(`${message.content.slice(message.client.prefix.length+command.length)}`)
	}
}