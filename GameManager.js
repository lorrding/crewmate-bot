const { sendThenDelete, getHexa } = require('./toolbox')
const Game = require('./Game')

//class used to manager every game objects
class GameManager {
    #gameList = new Array()
    #guildList = new Array()
    #authorList = new Array()

    constructor() {
    }

    createGame(message, tempHeures, tempMinutes) {
        this.#gameList.forEach(function (value, index) {
            console.log(value, index)
        })
        if (this.#gameList.length === 0) {
            // new Game.Game(message, tempHeures, tempMinutes)
        }
    }

    addGame(message, tempHeures, tempMinutes) {
        if (this.#guildList.some(guild => guild.id == message.guild.id)) return sendThenDelete(message.channel, `Une partie existe déjà sur ce serveur Discord!`)
        if (this.#authorList.some(author => author.id == message.author.id)) return sendThenDelete(message.channel, `Vous êtes déjà l'auteur d'une partie!`)

        this.#gameList.push(new Game.Game(message, tempHeures, tempMinutes))
        this.#guildList.push(message.guild)
        this.#authorList.push(message.author)

        return message.delete()
    }
}

module.exports = {
    GameManager
}