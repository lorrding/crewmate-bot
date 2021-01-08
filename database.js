const {Client} = require('pg')

const dbClient = new Client({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false
	}
})
dbClient.connect()

const self = module.exports = {
	fetchAll : function (callback) {
		dbClient.query('SELECT * FROM guilds;', (err, res) => {
			if (err) console.error(err)

			if (res.rows.length > 0) {
				callback(res.rows)
			}
		})
	},

	fetchGuild : function (guildId, callback) {
		const sql = 'SELECT * FROM guilds where guild_id = $1;'
		const values = [guildId]

		dbClient.query(sql, values, (err, res) => {
			if (err) console.error(err)
			if (res.rows.length > 0) {
				callback(res.rows)
			}
		})
	},

	addGuild : function (guildId, prefix, callback) {
		const sql = 'insert into guilds (guild_id, prefix, queue, game) VALUES ($1, $2, Null, Null);'
		const values = [guildId, prefix]

		dbClient.query(sql, values, (err) => {
			if (err) {
				callback(err)
			} else {
				callback(0)
			}
		})
	},

	updateGuild : function (guildId, prefix, callback) {
		const sql = 'update guilds set prefix = $2 where guild_id = $1;'
		const values = [guildId, prefix]

		dbClient.query(sql, values, (err) => {
			if (err) {
				callback(err)
			} else {
				callback(0)
			}
		})
	},
}