const {SlashCommandBuilder} = require("@discordjs/builders")

module.exports = {
	global: false,
	data: new SlashCommandBuilder()
		.setName('iquit')
		.setDescription('Pour retirer un rôle de jeu')
		.addStringOption(option =>
			option.setName('jeu')
				.setDescription('Le nom du jeu')
				.setRequired(true)
				.addChoice('Lost Ark', '288784766822514700')
				.addChoice('Afk Arena', '1')
				.addChoice('Valorant', '2')
				.addChoice('World of Warcraft', '3')
		),
	async execute(interaction) {
		if (!interaction.guild.me.permissions.has('MODERATE_MEMBERS')) return interaction.reply({content: 'Erreur! Le bot n\'a pas les droit suffisant pour vous retirer le rôle. Contactez un admin.', ephemeral: true})

		const roleStr = interaction.options.getString('jeu')

		await interaction.guild.roles.fetch(roleStr)
			.then(role => {
				if (interaction.guild.me.roles.highest.comparePositionTo(role) < 1) {
					return interaction.reply({content: 'Erreur! Le bot n\'a pas les droit suffisant pour vous retirer ce rôle car il est supérieur aux siens! Contactez un admin.', ephemeral: true})
				} else {
					interaction.member.roles.remove(role)
					interaction.reply({content: 'Rôle Retiré 👌', ephemeral: true})
				}
			})
			.catch(e => {
				return interaction.reply({content: `error: ${e}`, ephemeral: true})
			})
	}
}