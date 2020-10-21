module.exports = {
        login : function(client) {
        return client.login(process.env.BOT_TOKEN);
    }
}