const { db_connect} = require('./connect')

class Database {
	#conn // connexion point

	constructor() {
		try {
			this.#conn = db_connect()
			return console.log("Connected to DataBase...")
		} catch (e) {
			return console.log(`Database connexion error:\n${e}`)
		}
	}

	checkDB() {

	}

	// updateGManager(gameList) {
	// 	let formattedList = ""
	// 	gameList.forEach(game => formattedList+="")
	// }

	addGameDB(game) {
		let sql = "SELECT * FROM `game` WHERE 1"
		// let sql = `insert into game (guild, channel, message, author, hours, minutes, game_id) values (${game.getGuild().id}, ${game.getChannel().id}, ${game.getMessage().id}, ${game.getAuthor().id}, ${game.getHours()}, ${game.getMinutes()}, '')`
		this.#conn.query(sql, function (err) {
			if (err) console.log(err)
		})
	}
}

module.exports = {
	Database
}