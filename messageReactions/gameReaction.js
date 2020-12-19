const { gameManager } = require("../Games/GameManager")

module.exports = {
	name : "AU_Thumbsup",
	id: "764917952600342539",
	description: "AU_ThumbsUp for interacting with game",
	async execute(reactionGot, user, type) {
		if (type === "add") {
			console.log("yay1")
			await gameManager.manageAddReaction(reactionGot, user)
		} else {
			console.log("yay2")
			await gameManager.manageRemoveReaction(reactionGot, user)
		}
	}
}