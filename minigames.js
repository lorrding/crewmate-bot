const { MessageEmbed } = require("discord.js")

module.exports = {
	CacheCache : function(channel) {
		let embed = new MessageEmbed()
			.setColor('#F6F658')
			.setTitle(`Cache-Cache`)
			.setThumbnail(`https://static.wikia.nocookie.net/among-us-wiki/images/9/92/Yellow.png`)
			.setDescription("*Les Crewmates doivent tout faire pour réaliser l'entièreté de leurs tâches tout en restant cacher et à distance de l'Imposteur.*")
			.addField(`\u200B `,`\u200B`)
			.addField(`Règles:`,`- Il n'est pas nécessaire que l'Imposteur se révèle et se dévoile.\n- Il est interdit de signaler les corps.\n- Il est interdit d'expulser l'Imposteur.\n- Il est interdit de ne pas effectuer les tâches.\n- Aucun sabotage autorisé, sauf les portes.\n+ Il peut être convenu que l'imposteur n'ait pas le droit d'utiliser admin.`)
			.addField(`\u200B `,`\u200B`)
			.addField(`Maps `,`The Skeld ou Polus`, true)
			.addField(`Impostors`,`1`, true)
			.addField(`Confirm Ejects`,`Off`, true)
			.addField(`Emergency Meetings`,`0`, true)
			.addField(`Emergency Cooldown`,`0 seconde`, true)
			.addField(`\u200B `,`\u200B`, true)
			.addField(`Discussion Time`,`0 seconde`, true)
			.addField(`Voting Time`,`0 seconde`, true)
			.addField(`\u200B `,`\u200B`, true)
			.addField(`Player Speed`,`1,0x`, true)
			.addField(`Crewmate Vision`,` 0,5x`, true)
			.addField(`Impostor Vision`,` 0,25x`, true)
			.addField(`Kill Cooldown`,`15 ou 20 secondes`, true)
			.addField(`Kill Distance`,`Short`, true)
			.addField(`Visual Tasks`,`Off`, true)
			.addField(`Common Tasks`,`0`, true)
			.addField(`Long Tasks`,`0`, true)
			.addField(`Short Tasks`,`5`, true)
		try {
			channel.send(embed)
		} catch (error) {
			console.log(error)
		}
	},

	SlenderMan : function(channel) {
		let embed = new MessageEmbed()
			.setColor("#3F474E")
			.setTitle(`SlenderMan`)
			.setThumbnail(`https://static.wikia.nocookie.net/among-us-wiki/images/7/71/Black.png`)
			.setDescription("*Les Crewmates ne verront quasiment plus rien et devront déterminer quelles sont les tâches à effectuer, tandis que l'Imposteur tentera d'éliminer l'ensemble des joueurs le plus rapidement possible.*")
			.addField(`\u200B `,`\u200B`)
			.addField(`Règles:`,`- Seul les lumières peuvent être saboté et elle devront l'être au début de la partie.\n- Il est interdit d'expulser l'Imposteur.\n- Il est interdit de signaler les corps.\n- Il est interdit de ne pas effectuer les tâches.\n+ Il peut être convenu que l'imposteur n'ait pas le droit d'utiliser admin.`)
			.addField(`\u200B `,`\u200B`)
			.addField(`Maps `,`The Skeld`, true)
			.addField(`Impostors`,`1`, true)
			.addField(`Confirm Ejects`,`Off`, true)
			.addField(`Emergency Meetings`,`0`, true)
			.addField(`Emergency Cooldown`,`0 seconde`, true)
			.addField(`\u200B `,`\u200B`, true)
			.addField(`Discussion Time`,`0 seconde`, true)
			.addField(`Voting Time`,`0 seconde`, true)
			.addField(`\u200B `,`\u200B`, true)
			.addField(`Player Speed`,`1,5x`, true)
			.addField(`Crewmate Vision`,` 0,5x`, true)
			.addField(`Impostor Vision`,` 1,5x`, true)
			.addField(`Kill Cooldown`,`30 secondes`, true)
			.addField(`Kill Distance`,`Short`, true)
			.addField(`Visual Tasks`,`Off`, true)
			.addField(`Common Tasks`,`0`, true)
			.addField(`Long Tasks`,`0`, true)
			.addField(`Short Tasks`,`5`, true)
		try {
			channel.send(embed)  
		} catch (error) {
			console.log(error)
		}
	},

	PieceSecu : function(channel) {
		let embed = new MessageEmbed()
			.setColor("#C51111")
			.setTitle(`Pièces sécurisées`)
			.setThumbnail(`https://static.wikia.nocookie.net/among-us-wiki/images/3/31/Red.png`)
			.setDescription("*Au début d'une partie, l'Imposteur se dévoile et choisie deux salles dans lesquelles il ne pourra tuer personne puis la partie commence. Lorsque l'Imposteur tue quelqu'un, il doit immédiatement le signaler et définir deux nouvelles pièces où les Crewmates seront en sécurité.*")
			.addField(`\u200B `,`\u200B`)
			.addField(`Règles:`,`- L'imposteur doit se révéler au début de la partie.\n- Il est interdit d'expulser l'Imposteur.\n- Il est interdit de ne pas effectuer les tâches.\n- Le camping est interdit.\n- Il est interdit de tuer un innocent dans une pièce sécurisée.\n- Aucun sabotage autorisé.`)
			.addField(`\u200B `,`\u200B`)
			.addField(`Maps `,`The Skeld ou Polus`, true)
			.addField(`Impostors`,`1`, true)
			.addField(`Confirm Ejects`,`Off`, true)
			.addField(`Emergency Meetings`,`0`, true)
			.addField(`Emergency Cooldown`,`0 seconde`, true)
			.addField(`\u200B `,`\u200B`, true)
			.addField(`Discussion Time`,`0 seconde`, true)
			.addField(`Voting Time`,`0 seconde`, true)
			.addField(`\u200B `,`\u200B`, true)
			.addField(`Player Speed`,`1,75x`, true)
			.addField(`Crewmate Vision`,` 1,0x`, true)
			.addField(`Impostor Vision`,` 1,0x`, true)
			.addField(`Kill Cooldown`,`20 secondes`, true)
			.addField(`Kill Distance`,`Short`, true)
			.addField(`Visual Tasks`,`Off`, true)
			.addField(`Common Tasks`,`1`, true)
			.addField(`Long Tasks`,`0`, true)
			// .addField(`Short Tasks`,`5\n*(Mettre un task de moins que le nombre de crewmate si vous êtes moins de 6)*`, true)
			.addField(`Short Tasks`,`5`, true)
		try {
			channel.send(embed)  
		} catch (error) {
			console.log(error)
		}
	},

	ChambreSecu2 : function(channel) {
		let embed = new MessageEmbed()
			.setColor("#71491E")
			.setTitle(`Chambre sécurisée 2.0`)
			.setThumbnail(`https://static.wikia.nocookie.net/among-us-wiki/images/0/06/Brown.png`)
			.setDescription("*Avant de rentrer dans le lobby, tous les participants doivent changer leur pseudo afin de prendre le nom d'une pièce de la carte. Chaque joueur aura le droit de se réfugier dans la pièce dont il porte le nom sans qu'il puisse être tué par l'Imposteur. Par exemple, si un joueur se nomme Storage, il ne pourra pas être sauvagement assassiner par l'Imposteur s'il s'y trouve.*")
			.addField(`\u200B `,`\u200B`)
			.addField(`Règles:`,`- Il n'est pas nécessaire que l'Imposteur se révèle et se dévoile.\n- Il est interdit de tuer un joueur portant le nom de la pièce dans laquelle il se trouve.\n- Il est interdit de signaler les corps trouvés.\n- Il est interdit d'expulser l'Imposteur.\n- Le camping est interdit.\n- Il est interdit de ne pas effectuer les tâches.\n- Il est interdit de saboter quoi que ce soit.\n- Plusieurs joueurs peuvent choisir le même nom.`)
			.addField(`\u200B `,`\u200B`)
			.addField(`Maps `,`The Skeld`, true)
			.addField(`Impostors`,`1`, true)
			.addField(`Confirm Ejects`,`Off`, true)
			.addField(`Emergency Meetings`,`0`, true)
			.addField(`Emergency Cooldown`,`0 seconde`, true)
			.addField(`\u200B `,`\u200B`, true)
			.addField(`Discussion Time`,`0 seconde`, true)
			.addField(`Voting Time`,`0 seconde`, true)
			.addField(`\u200B `,`\u200B`, true)
			.addField(`Player Speed`,`1,25x`, true)
			.addField(`Crewmate Vision`,` 1,25x`, true)
			.addField(`Impostor Vision`,` 1,5x`, true)
			.addField(`Kill Cooldown`,`20 secondes`, true)
			.addField(`Kill Distance`,`Short`, true)
			.addField(`Visual Tasks`,`Off`, true)
			.addField(`Common Tasks`,`2`, true)
			.addField(`Long Tasks`,`2`, true)
			.addField(`Short Tasks`,`4`, true)
		try {
			channel.send(embed)  
		} catch (error) {
			console.log(error)
		}
	},

	CoursPoursuite : function(channel) {
		let author = "Laidjy#7846"
		let authorAvatar = "https://cdn.discordapp.com/avatars/366568693812953088/32578985ba30d7db3b2e51968f2ceb8e.png"
		let embed = new MessageEmbed()
			.setColor("#50EF39")
			.setTitle(`Course-Poursuite`)
			.setThumbnail(`https://static.wikia.nocookie.net/among-us-wiki/images/3/34/Lime.png`)
			.setDescription("*L'imposteur se révèle au début de la partie et laisse les Crewmates se cacher le temps de son cooldown. L'imposteur doit tuer tout le monde dans un temps impartit pendant que les Crewmates tentent de rester cachés.*")
			.addField(`\u200B `,`\u200B`)
			.addField(`Règles:`,`- L'Imposteur dois se révéler au début de la partie.\n- L'imposteur ne doit pas bouger le temps de son cooldown.\n- Aucun tâche ne doit être effectuée.\n- Il est interdit de report les corps.\n- Aucun sabotage autorisé.\n- Un minuteur doit être défini et lancé au moment où l'imposteur commence à bouger.\n+ Il peut être convenu que l'imposteur n'ait pas le droit d'utiliser admin.`)
			.addField(`\u200B `,`\u200B`)
			.addField(`Maps `,`The Skeld ou Polus`, true)
			.addField(`Impostors`,`1`, true)
			.addField(`Confirm Ejects`,`Off`, true)
			.addField(`Emergency Meetings`,`0`, true)
			.addField(`Emergency Cooldown`,`0 seconde`, true)
			.addField(`\u200B `,`\u200B`, true)
			.addField(`Discussion Time`,`0 seconde`, true)
			.addField(`Voting Time`,`0 seconde`, true)
			.addField(`\u200B `,`\u200B`, true)
			.addField(`Player Speed`,`1,0x ou 1,25x`, true)
			.addField(`Crewmate Vision`,` 0,75x`, true)
			.addField(`Impostor Vision`,` 0,25x`, true)
			.addField(`Kill Cooldown`,`10 secondes`, true)
			.addField(`Kill Distance`,`Short`, true)
			.addField(`Visual Tasks`,`Off`, true)
			.addField(`Common Tasks`,`1`, true)
			.addField(`Long Tasks`,`0`, true)
			.addField(`Short Tasks`,`0`, true)
			.addField(`Timer`,`45 secondes par Crewmates`, true)
			.addField(`\u200B `,`\u200B`)
			.setFooter(`${author} a eu cette idée géniale`,`${authorAvatar}`)
		try {
			channel.send(embed)  
		} catch (error) {
			console.log(error)
		}
	},

	Protips : function(channel) {
		let embed = new MessageEmbed()
			.setColor("#38FEDB")
			.setTitle(`Protips:`)
			.setThumbnail(`https://i.imgur.com/IBaefEW.png`)
			.addField(`Pensez à réduire le nombre de tasks si vous êtes moins de 7 joueurs`,`- Pour les mini-jeux sans long/common tasks, mettez 1 task de moins que le nombre de crewmate\n- Pour les mini-jeux avec long/common tasks, réduisez en priorité les long, puis les common.`)
			.addField(`\u200B `,`\u200B`)
			.addField(`Cyan est réservé à une seule personne, et cette personne est la meilleure`,`*À peu près hein, pas exactement... En fait si c'est exactement ça.*`)
		try {
			channel.send(embed)  
		} catch (error) {
			console.log(error)
		}
	}
}


// test : function(channel) {
//	 let embed = new MessageEmbed()
//		 .setColor("#FFFF00")
//		 .setTitle(`I'm a test!`)
//		 .setThumbnail(`https://gamewave.fr/static/images/medias/upload/Florian/Among%20Us/amongusyellow.png`)
//		 .setDescription("*Les Crewmates doivent tout faire pour réaliser l'entièreté de leurs tâches tout en restant cacher et à distance de l'Imposteur.*")
//		 .addFields(
//				 { name: `Règles:`, value: `- Il n'est pas nécessaire que l'Imposteur se révèle et se dévoile.\n- Il est interdit de signaler les corps.\n- Il est interdit d'expulser l'Imposteur.\n- Il est interdit de ne pas effectuer les tâches.\n- Il est interdit de saboter une pièce tant qu'il ne s'agit pas d'un local électrique.`, inline: false},
//				 { name: '\u200B', value: '\u200B' },
//				 { name: `Maps `, value: `The Skeld ou Polus`, inline: true},
//				 { name: `Impostors`, value: `1`, inline: true},
//				 { name: `Confirm Ejects`, value: `Off`, inline: true},
//				 { name: `Emergency Meetings`, value: `1`, inline: true},
//				 { name: `Emergency Cooldown`, value: `0 seconde`, inline: true},
//				 { name: `Discussion Time`, value: `0 seconde`, inline: true},
//				 { name: `Voting Time`, value: `0 seconde`, inline: true},
//				 { name: `Player Speed`, value: `1,0x`, inline: true},
//				 { name: `Crewmate Vision`, value: ` 0,5x`, inline: true},
//				 { name: `Impostor Vision`, value: ` 0,25x`, inline: true},
//				 { name: `Kill Cooldown`, value: `10 secondes`, inline: true},
//				 { name: `Kill Distance`, value: `Short`, inline: true},
//				 { name: `Visual Tasks`, value: `Off`, inline: true},
//				 { name: `Common Tasks`, value: `0`, inline: true},
//				 { name: `Long Tasks`, value: `0`, inline: true},
//				 { name: `Short Tasks`, value: `5`, inline: true}
//			 )
//	 try {
//		 channel.send(embed)  
//	 } catch (error) {
//		 console.log(error)
//	 }
// },