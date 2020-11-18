module.exports = {
        login : function(client) {
        return client.login(process.env.BOT_TOKEN);
    },
        db_connect : function () {
            const mysql = require('mysql')
            return mysql.createConnection({
                database: 'DB_NAME',
                host : 'DB_HOST',
                user : 'DB_USER',
                password : 'DB_PWD',
            })
        }
}