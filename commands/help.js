const { MessageEmbed } = require('discord.js')
const {getHexa} = require("../toolbox")

module.exports = {
	name: "help",
	aliases: ["h"],
	description: "Display help for all commands",

	async execute(message) {
		let commands = message.client.commands.array()
		let info = message.client.commands.get("info")
		info.execute(message, true).catch(() => {})

		let embed = new MessageEmbed()
			.setTitle(`${message.client.user.username} Help`)
			.setDescription("List of all commands")
			.setColor(getHexa())

		commands.forEach((cmd) => {
			embed.addField(`${cmd.name} ${cmd.aliases ? `(or ${cmd.aliases})` : ""}`,
				`${cmd.description ? `${cmd.description}` : "No info."}`,
				true
			)
		})

		embed.setTimestamp()

		await message.author.createDM().then(DMChannel => DMChannel.send(embed))
		await message.author.deleteDM()
	}
}