const { MessageEmbed } = require('discord.js')
const {getHexa} = require("../toolbox")

module.exports = {
	name: "help",
	aliases: ["h"],
	description: "Display all commands and descriptions",
	async execute(message) {
		let commands = message.client.commands.array()

		let embed = new MessageEmbed()
			.setTitle(`${message.client.user.username} Help`)
			.setDescription("List of all commands")
			.setColor(getHexa())

		commands.forEach((cmd) => {
			embed.addField(`**${message.client.prefix}${cmd.name} ${cmd.aliases ? `(${cmd.aliases})` : ""}**`,
				`${cmd.description}`,
				true
			)
		})

		embed.setTimestamp()

		await message.author.createDM().then(DMChannel => DMChannel.send(`https://discord.com/oauth2/authorize?client_id=${message.client.user.id}&permissions=3434560&scope=bot`))
		message.delete().catch(() => {})
		await message.author.deleteDM()
	}
}