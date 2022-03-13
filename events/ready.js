const { GameManager } = require('../Games/GameManager')

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		let CDJChannel = client.channels.cache.find(channel => channel.id === '764910769132929049')
		client.gameManager = new GameManager(CDJChannel, client.commands.get("purge"))
		if (client.botGuilds) {
			client.gameManager.restoreDB(client)
		} else {
			console.log("error, data not ready")
			console.log(client.botGuilds)
		}
		console.log(`logged in as ${client.user.tag}, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} server.`)
		client.user.setActivity("Among Us", {
			type: "STREAMING",
			url: "https://youtu.be/dQw4w9WgXcQ"
		})
	},
}

