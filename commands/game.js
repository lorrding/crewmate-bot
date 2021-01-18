const {help} = require("../help/help")
const {sendThenDelete} = require("../toolbox")

module.exports = {
	name: "game",
	aliases: ["g"],
	description: "Create and manage game of among us",
	async execute(message, args) {
		if (!args.length) {
			sendThenDelete(message.channel, "Arguments manquant!\n /game -help pour plus d'infos")
		}
		let arg = args[0]

		switch (arg) {
			case "-add":
			case "-a":
			case "add":
			case "a":
				// création d'une partie
				await args.shift()
				return message.client.gameManager.addGame(message, args)
			case "-delete":
			case "-d":
			case "d":
				//suppression d'un partie en court
				return message.client.gameManager.deleteGame(message)
			case "-help":
			case "-h":
			case "h":
				//help
				try {
					message.author.createDM().then(DMChannel => DMChannel.send(help("-g")))
				} catch (e) {
					return sendThenDelete(message.channel, `${e}`)
				}
				break
			case "-dump":
				if (message.member.hasPermission('ADMINISTRATOR') || message.author.id === "224230450099519488") {
					//dump var
					sendThenDelete(message.channel, message.client.gameManager.dumpVars(), 30000)
				}
				break
			default:
				let channel = message.channel
				try {
					sendThenDelete(channel, `argument invalide ou non détecté!\n tapez '*/game -help*' pour plus d'info...`)
					console.log('no arguments found for /game')
				} catch (error) {
					sendThenDelete(channel, 'Error deleting message.')
						.then(console.log(error))
				}
				break
		}
	}
}