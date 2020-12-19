module.exports = {
	name : "AU_Thumbsup",
	id: "764917952600342539",
	description: "AU_ThumbsUp for interacting with game",
	async execute(reactionGot, user, type) {
		if (type === "add") {
			await reactionGot.client.gameManager.manageAddReaction(reactionGot, user)
		} else {
			await reactionGot.client.gameManager.manageRemoveReaction(reactionGot, user)
		}
	}
}