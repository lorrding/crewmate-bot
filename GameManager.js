const { sendThenDelete } = require('./toolbox')
const Game = require('./Game')
const CronManager = require('./CronManager')

//class used to manager every game objects
class GameManager {
	#gameList = []
	#guildList = []
	#authorList = []
	#CronManager = new CronManager.CronManager()

	constructor() {
	}

	createGame(message, tempHeures, tempMinutes) {
		this.#gameList.push(new Game.Game(message, tempHeures, tempMinutes))
		this.#guildList.push(message.guild)
		return this.#authorList.push(message.author)
	}

	deleteGame(message) {
		// checking if message's author is a game author or has admin rights
		if (!this.#gameList.some(game => game.getAuthor().id === message.author.id)) {
			if(!this.#gameList.some(game => game.getAuthor()))
			return sendThenDelete(message.channel, `Vous n'êtes à l'origine d'aucune partie!`)
		}

		// if (this.#authorList.some(author => author.id === message.author.id))
		// if (message.author.id !== author.id || !message.member.hasPermission('ADMINISTRATOR')) {
		// 	console.log('nole : not admin or creator');
		// 	message.channel.send("Vous n'êtes pas à l'origine de cette partie ou n'avez pas les droits pour les annuler!")
		// 		.then(msg=> {
		// 			sendThenDelete(message.channel, msg, 5000)
		// 		});
		// 	return message.delete();
		// }

		//c'est good, on suprime
		// message.delete();
		// deleteGame();
		return message.delete()
	}

	addGame(message, args) {
		if (this.#guildList.some(guild => guild.id === message.guild.id)) return sendThenDelete(message.channel, `Une partie existe déjà sur ce serveur Discord!`)
		if (this.#authorList.some(author => author.id === message.author.id)) return sendThenDelete(message.channel, `Vous êtes déjà l'auteur d'une partie!`)
		if (!args.length) return sendThenDelete(message.channel, `Aucun argument de temps fourni!!`)

		let formattedArgs = this.#CronManager.checkArgs(message, args)
		let hours = formattedArgs.shift()
		let minutes = formattedArgs.shift()
		console.log(`hours: ${hours} // minutes: ${minutes}`)
		this.createGame(message, hours, minutes)
		return message.delete()
	}
}

module.exports = {
	GameManager
}