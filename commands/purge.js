const {sendThenDelete} = require("../toolbox")

module.exports = {
	name: "purge",
	aliases: ["delete", "del"],
	description: "Useful function to delete specific message",
	async execute(message, args, clearCDT, CDJChannel) {
		if (message !== undefined && clearCDT !== true) {
			if (message.member.hasPermission('ADMINISTRATOR') || message.author.id === "224230450099519488") {
				console.log('200, authorised..')
				switch (args[0]) {
					case "-all":
					case "all":
					case "a":
						if (parseInt(args[1]) <= 0 || parseInt(args[1]) >= 100) return sendThenDelete(message.channel, "le nombre de message à supprimer doit être entre 1 et 99")
						try {
							console.log(`starting deletion of ${args[1]} messages..`)
							const fetched = await message.channel.messages.fetch({limit: parseInt(args[1])})
							fetched.forEach(fetchedMessage => {
								if (fetchedMessage.deletable) fetchedMessage.delete()
							}).then(
								console.log(`messages deleted..`)
							)
						} catch (e) {
							return sendThenDelete(message.channel, `${e}`)
						}
						break
					case "-bulk":
					case "bulk":
					case "b":
					case "-b":
					case "@":
						try {
							console.log(`bulk deleting message that are less than 2 weeks old..`)
							await message.channel.bulkDelete(await message.channel.messages.fetch({limit: 99}), true)
						} catch (e) {
							return sendThenDelete(message.channel, `${e}`)
						}
						break
					default :
						console.log("unknown argument")
						return sendThenDelete(message.channel, "Argument invalide")
				}
			} else {
				return sendThenDelete(message.channel, "403, forbidden command.")
			}
		} else {
			try {
				console.log(`automatically bulk deleting message that are less than 2 weeks old in CDJ channel`)
				await CDJChannel.bulkDelete(await CDJChannel.messages.fetch({limit: 99}), true)
			} catch (e) {
				return sendThenDelete(CDJChannel, `${e}`)
			}
		}
	}
}