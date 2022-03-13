const {showDate} = require("../toolbox")

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		if (!interaction.isCommand()) return

		const command = interaction.client.interactions.get(interaction.commandName)

		if (!command) return

		try {
			console.log(`\nInteraction ${interaction.commandName} by ${interaction.user.tag} in '${interaction.guild.name}' at ${showDate(interaction.createdAt)}`)

			await command.execute(interaction)
		} catch (e) {
			console.error(e)
			await interaction.reply({ content: "erreur lors de l'exécution de la command!", ephemeral: true})
		}
	},
}