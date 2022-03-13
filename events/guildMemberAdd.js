module.exports = {
	name: 'guildMemberAdd',
	execute(member) {
		console.log("new user detected!")
		const guild = member.client.botGuilds.get(member.guild.id)
		if (typeof guild !== undefined && guild.greetings !== false) {
			// const channel = member.guild.systemChannel
			if (guild.greetings_msg !== 'null') {
				console.log("greeting message found...")
				let greeting = guild.greetings_msg
				console.log(greeting)
				let splicedGreeting = greeting.split('${member}')
				console.log(splicedGreeting)
				return member.guild.systemChannel ? member.guild.systemChannel.send(`${splicedGreeting[0]}${member}${splicedGreeting[1]}`) : ""
			} else {
				console.log("no greeting message, using default..")
				return member.guild.systemChannel ? member.guild.systemChannel.send(`Bienvenue ${member}`) : ""
			}
		} else {
			console.log("Guild does not greet new user :sad:")
		}
	}
}