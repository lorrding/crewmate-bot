module.exports = {
	//send a message, then delete it after x millisecondes
	sendThenDelete : function (channel, message, ms = 5000) {
		try {
			return channel.send(message)
			.then(msg=> {
				msg.delete({timeout: ms})
			})
		} catch (error) {
			console.log(`Error deleting message...\n${error}`);
		}
	},

	// format text for game embed message
	formatEmbedTime : function(hours, minutes) {
		let str = ""
		let date = new Date()
		
		//today or tomorrow ? utc+1 = summer /---/ utc+0 = winter
		console.log("creating embed time..")
		if (date.getUTCHours()+1 < hours) {str += "Ce "}
		else if (date.getUTCHours()+1 == hours) {
			if (date.getUTCMinutes() < minutes) {str += "Ce "}
			else {str += "Demain "}
		} else {str += "Demain "}

		// morning, evening, night..?
		if (hours >= 18 || hours < 3) {
			str += "soir"
		} else if (hours >= 14) {
			if (str === "Ce ") {
				str = str.slice(0, -1)
				str += "t après-midi"
			} else  {
				str += "après-midi"
			}
		} else if (hours >= 12) {
			str += "midi"
		} else {
			str += "matin"
		}
		return str
	},

	// format list of players
	formatListPlayers : function(listPlayers) {
		let listToString = ""
		for (let i = 0; i < listPlayers.length; i++) {
			if (listPlayers.length > 1) {
				if (i >= listPlayers.length-1) {
					//on remove ", "
					listToString = listToString.slice(0, -2)
					// et on met le dernier élément à la place
					listToString+=` et ${listPlayers[i]}.`
				} else {
					listToString+=`${listPlayers[i]}, `
				}
			} else {
				listToString+=`${listPlayers[i]}.`
			}
		}
		return listToString
	},

	// random hexadecimal number for embeds color
	getHexa : function () {
		return '#'+Math.floor(Math.random()*16777215).toString(16);
	},

	// random number between to included integers
	// getRandom : function (min, max) {
	// 	return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) +1)) + Math.ceil(min);
	// }
}