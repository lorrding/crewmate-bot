module.exports = {
	name: "addme",
	aliases: ["invite"],
	description: "Invite the bot to your discord",
	async execute(message) {
		await message.author.createDM().then(DMChannel => DMChannel.send(`https://discord.com/oauth2/authorize?client_id=${message.client.user.id}&permissions=3434560&scope=bot`))
		message.delete()
		await message.author.deleteDM()
	}
}