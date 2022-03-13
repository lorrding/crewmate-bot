const {dev} = require("../commands/dev")
const {inDev, getReaction, showDate, sendThenDelete} = require("../toolbox")

module.exports = {
	name: "messageReactionAdd",
	async execute(reaction, user) {
		if (dev) return inDev(reaction.message.channel)
		//if bot, then don't
		if (user.bot) return

		const emittedReaction = getReaction(reaction)
		console.log(`\nReaction ${emittedReaction.emoji.name} added by ${user.username}#${user.discriminator} in '${emittedReaction.message.guild.name}' at ${showDate(emittedReaction.message.createdAt)}`)


		const reactionToExec = reaction.client.messageReactions.get(emittedReaction.emoji.id)

		if (!reactionToExec) return console.log(`did not found ${emittedReaction.emoji.name} (id:${emittedReaction.emoji.id})`)

		try {
			reactionToExec.execute(emittedReaction, user, "add")
		} catch (e) {
			console.error(e)
			return sendThenDelete(emittedReaction.message.channel, `${e}`)
		}
	}
}