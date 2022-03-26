const {SlashCommandBuilder} = require("@discordjs/builders")

module.exports = {
	global: false,
	permissions: ["MANAGE_ROLES", "MANAGE_USERS"],
	data: new SlashCommandBuilder()
		.setName('removerole')
		.setDescription('Ajoute ou retire un rôle à un utilisateur')
		.addUserOption(option =>
			option.setName('member')
				.setDescription('La personne à qui on veut ajouter ou retirer un rôle')
				.setRequired(true)
		)
		.addStringOption(option =>
			option.setName('jeu')
				.setDescription('Le nom du jeu')
				.setRequired(true)
				.addChoice('Lost Ark', '941720151521394729')
				.addChoice('Afk Arena', '952315372063821866')
				.addChoice('Valorant', '952590313594167326')
				.addChoice('World of Warcraft', '952590369416171591')
				.addChoice('Rocket League', '957071909550424074')
		),
	async execute(interaction) {
		if (!interaction.guild.me.permissions.has('MANAGE_ROLES')) return interaction.reply({content: 'Erreur! Le bot n\'a pas les droit suffisant pour vous retirer le rôle. Contactez un admin.', ephemeral: true})

		const member = interaction.options.getMember('member')
		const roleStr = interaction.options.getString('jeu')

		await interaction.guild.roles.fetch(roleStr)
			.then(role => {
				if (interaction.guild.me.roles.highest.comparePositionTo(role) < 1) {
					return interaction.reply({content: 'Erreur! Le bot n\'a pas les droit suffisant pour vous retirer ce rôle car il est supérieur aux siens! Contactez un admin.', ephemeral: true})

				} else {
					member.roles.add(role)
					interaction.reply({content: `Rôle Retiré 👌 à ${member.username}`, ephemeral: true})
				}
			})
			.catch(e => {
				return interaction.reply({content: `error: ${e}`, ephemeral: true})
			})
	}
}