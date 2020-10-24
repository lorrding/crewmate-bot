module.exports = {

	//send a message, then delete it after x milisecondes
	sendThenDelete : function (channel, ms, message) {
		try {
			return channel.send(message)
			.then(msg=> {
				msg.delete(ms);
			});
		} catch (error) {
			console.log(`Error deleting message...\n${error}`);	
		}
	},

	// format text for game embed message
	formatEmbedTime : function(hours, minutes) {
		let str = "";
		let date = new Date();
		
		//today or tomorrow ?
		if (date.getUTCHours()+2 <= hours) { // utc+2 = summer
			if (date.getUTCMinutes()+2 < minutes) { // utc+1 = winter
				str += "Ce "
			} else {
				str += "Demain "
			}
		} else {
			str += "Demain "
		}

		// morning, evening, night..?
		if (18 <= hours < 3) {
			str += "soir"
		} else if (hours >= 14) {
			if (str == "Ce ") {
				str = str.slice(0, -1); 
				str += "t aprèm"
			} else  {
				str += "aprèm"
			}
		} else if (str >= 12) {
			str += "midi"
		} else {
			str += "matin"
		}
		return str
	},

	// random hexadecimal number for embeds color
	getHexa : function () {
		return '#'+Math.floor(Math.random()*16777215).toString(16);
	},

	// random number between to included integers
	getRandom : function (min, max) {
		return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) +1)) + Math.ceil(min);
	}
}