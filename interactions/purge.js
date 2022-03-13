const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
	global: false,
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription("purge useless members"),
	async execute(interaction) {
		await interaction.user.createDM().then(DMChannel => DMChannel.send(`https://discord.com/oauth2/authorize?client_id=${interaction.client.user.id}&permissions=3434560&scope=bot`))
		await interaction.user.deleteDM()
	}
}