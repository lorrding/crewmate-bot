const {SlashCommandBuilder} = require("@discordjs/builders")

module.exports = {
	global: true,
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('pong'),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true })
		const [m] = await Promise.all([interaction.editReply({content: 'Ping?', ephemeral: true})])
		await interaction.editReply({content: `Pong! (${m.createdTimestamp - interaction.createdTimestamp}ms).\nLatence API: ${Math.round(interaction.client.ws.ping)}ms.`, ephemeral: true})
	}
}