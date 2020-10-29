const Discord = require('discord.js');

const client = new Discord.Client();
const config = require("./config.json");
const connect = require("./connect.js")
const cron = require('node-cron');

dev = false;
pingMsg = new Discord.Message();
setGlobales();

client.on('ready',async m => {
	console.log(`logged in as ${client.user.tag}, in ${client.channels.size} channels of ${client.guilds.size} server.`);
	client.user.setActivity("Among Us", {
		type: "STREAMING",
		url: "https://youtu.be/dQw4w9WgXcQ"
	});
});

//cron shedule
try {
	var task = cron.schedule(`* * * * *`, () => {
		if (gameSheduled) {
			let d = new Date();
			var h = d.getUTCHours()+2;
			var m = d.getMinutes();
			if (h == heures && m == minutes) {
				pingMsg = gameMessage.channel.send(`<@&767870145091600405>, c'est l'heure de jouer!\n Venez dans le vocal et rejoignez la game`);
				console.log('NOW!!!!!!');
				console.log('game is launched, deleting game object');
				return setTimeout(() => {  deleteGame(); }, 1000);
			}
		}
	}, {
		scheduled: false,
		timezone: "Europe/Paris"
	});
} catch (error) {
	let date_ob = new Date();
	// let date = ("0" + date_ob.getDate()).slice(-2);
	let hours = date_ob.getHours();
	let minutes = date_ob.getMinutes();
	console.log(`error at ${hours}:${minutes} \n${error}`);
}

client.on('message', async message => {
	
if (!message.content.startsWith(config.prefix) || message.author.bot) return;
const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
const command = args.shift().toLowerCase();
console.log(`Command ${command} by ${message.author.username}#${message.author.discriminator} in '${message.guild}' at ${message.createdAt}`);
if (args) console.log(`With argu ${args}`);

// activate/desactivate for dev
	if (command === "dev" && message.author.id == "224230450099519488") {
		if (dev) {
			dev = false;
			message.channel.send(`retour en mode normal.`)
				.then(msg=> {
					msg.delete(5000);
				});
			message.delete();
		} else {
			dev = true;
			message.channel.send(`Ok, passage en dev mode.`)
				.then(msg=> {
					msg.delete(5000);
				});
			message.delete();
		}
	}
	if (dev) {
		return console.log('MODE DEV, ignoring...');
	}

// game
	if (command === "game" || command === "g") {
		if (!args.length) {
			message.channel.send("Arguments manquant!\n```-h | --heure -> paramétrage de l'heure\n-d | --delete -> suppression de la game en court```")
				.then(msg=> {
					msg.delete(5000);
				});
			return message.delete();
		}
		// if (message.member.hasPermission('SEND_MESSAGES')) {
		// 	console.log('role : checked');
		// }

		args.forEach(function(element, index) {
			// création d'une partie
			if (element == "-h" || element == "-heure") {
				if (gameSheduled) {
					message.channel.send(`Une partie est déjà prévu!`)
						.then(msg=> {
							msg.delete(5000);
						});
					return message.delete();
				}
				if (index >= args.length-1) {
					message.channel.send(`Il manque l'heure de le la session de jeu!`)
						.then(msg=> {
							msg.delete(5000);
						});
					return message.delete();
				}
				let argument = args.shift();
				let regex = /^([0-9]|0[0-9]|1[0-9]|2[0-3])[:|h][0-5][0-9]$/;
				let time = args.shift();
				var match = time.match(regex);
				if (match==null) {
					console.log('invalid time format, return');
					message.channel.send("Format d'heure invalide \nL'heure doit être sous la forme ```0-23[h|:]0-60```")
					.then(msg=> {
						msg.delete(5000);
					});
					return message.delete();
				}
				console.log(`format d'heure ${time}: valide`);
				if (time.search("h") != -1) {
					console.log('detecting h..');
					time = time.split("h");	
				} else {
					console.log('no h.., using :');
					time = time.split(":");
				}
				let tempHeures = time.shift();
				let tempMinutes = time.shift();
				console.log(`heures: ${tempHeures}, minutes: ${tempMinutes}`);
				createGame(message, tempHeures, tempMinutes);
				return 0;
			}

			//suppression d'un partie en court
			if (element == "-d" || element == "-delete") {
				// on check si une game est en court
				if (!gameSheduled) {
					console.log('no game found...');
					message.channel.send("Aucune partie n'est prévue!")
						.then(msg=> {
							msg.delete(5000);
						});
					return message.delete();
				}

				// on check si c'est bien l'auteur de la game ou un admin
				if (message.author.id != author.id || !message.member.hasPermission('ADMINISTRATOR')) {
					console.log('nole : not admin or creator');
					message.channel.send("Vous n'êtes pas à l'origine de cette partie ou n'avez pas les droits pour les annuler!")
						.then(msg=> {
							msg.delete(5000);
						});
					return message.delete();
				}

				//c'est good, on suprime
				message.delete();
				deleteGame();
				return 0;

				// message.channel.send("Confirmer l'annulation de la partie ?\n(réagissez avec <:AU_thumbsup:764917952600342539> pour valider ou <:AU_why:765273043962298410> pour annuler)")
				// 	.then(msg => {
				// 		let emojiYes = '764917952600342539';
				// 		let emojiNo = '765273043962298410';
				// 		msg.react(emojiYes);
				// 		msg.react(emojiNo);
				// 		const filter = (reaction, user) => reaction.emoji.id === '764917952600342539' && user.id === message.author.id;
				// 		const collector = message.createReactionCollector(filter, { time: 10000 });
				// 		collector.on('collect', r => console.log(`Collected ${r.emoji.name}`));
				// 		collector.on('end', collected => console.log(`Collected ${collected.size} items`));

				// 		// var filter = (reaction, user) => {
				// 		// 	return reaction.emoji.id === '764917952600342539' || reaction.emoji.id === '765273043962298410' && user.id === message.author.id;
				// 		// };
				// 		// msg.awaitReactions(filter, { time: 10000 })
				// 		// 	.then(collected => console.log(collected.first()))
  				// 		// 	.catch(console.error);
				// 	});

			}

			console.log('no arguments found for -g');
			message.channel.send(`argument invalide ou non détecté!`)
				.then(msg=> {
					msg.delete(5000);
				});
			return message.delete();

		});
	}

// ping
	if (command === "ping") {
		var embed = new Discord.RichEmbed();
		embed.setColor('#FFFFFF');
		const m = await message.channel.send("Ping?");
		embed.setAuthor(`${message.author.username} -> ping`, `${message.author.displayAvatarURL}`);
		embed.addField(`Pong! (${m.createdTimestamp - message.createdTimestamp}ms).`,`Latence API: ${Math.round(client.ping)}ms.`);
		message.delete();
		m.delete();
		message.channel.send(embed);
	}

// help
	if (command === "help") {
		message.channel.send("Soon..");
	}

// say 
	if (command === "say") {
		message.delete().catch(O_o=>{});
		if (message.mentions.users.size) {
			const userid = message.mentions.users.map(user => {
				return `${user.id}`;
			});
			message.channel.send(`${message.content.slice(config.prefix.length+4)}`).catch(nop=>{message.channel.send("Rien à raconter...")});
		} else {
		message.channel.send(`${message.content.slice(config.prefix.length+4)}`).catch(nop=>{message.channel.send("Rien à raconter...")});
		}
	}
});

client.on('messageReactionAdd', async (reaction, user) => {
	if (dev) {
		return console.log('MODE DEV, ignoring...');
	}
	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			return console.log(`Something went wrong when fetching the message: ${error}`);
		}
	}

	//if bot, then don't
	if (user.bot) return 0;

	//if wrong message, then don't
	if (reaction.message.id != gameMessage.id) {
		return 0;
	}

	//wrong reaction
	if (reaction.emoji.id != "764917952600342539") return;

	// si c'est l'auteur du message, on ignore
	if(user.id == author.id) {
		reaction.message.channel.send("La personne qui propose de jouer est déjà dans la liste des joueurs, pas besoin de réagir au message!")
			.then(msg=> {
				msg.delete(5000);
			});
		reaction.remove(user);
		return console.log('author already un list, ignoring...');
	}

	if (listJoueurs.length >= 10) {
		reaction.message.channel.send("Nombre de joueurs max atteint!");
		reaction.message.channel.send("<:AU_why:765273043962298410>")
			.then(msg=> {
				msg.delete(7000);
			});
		try {
			reaction.remove(user);
		} catch (error) {
			return console.log(error);
		}
		return console.log('Max player reached, removing reaction.');
	}

	// on vérifie que la liste n'est pas vide
	if (listJoueurs.length > 0) {
		//si il est déjà dans la liste de jeu, on ignore
		if (listJoueurs.find(user => user == user.username)) {
			try {		
				reaction.message.channel.send("Vous êtes déjà dans la liste des joueurs! (mais nous n'êtes même pas censé voir cette erreur)")
					.then(msg=> {
						msg.delete(5000);
					});
			} catch (error) {
				console.log(error);
			}
			return console.log('user already un list, ignoring...');
		}
	}
	
	//tout les if sont passé, c'est good
	// ajout dans la liste + ajout du role
	try {
		console.log(`Adding user ${user.username}...`);
		let role = reaction.message.guild.roles.find(r => r.name === "joueurDuSoir");
		let member = reaction.message.guild.members.find(r => r.id === user.id);
		member.addRole(role);
		listJoueurs.push(`${user.username}`);
		editEmbed(reaction.message);
	} catch (error) {
		console.log(error);
	}
});

client.on('messageReactionRemove', async (reaction, user) => {
	if (dev) {
		return console.log('MODE DEV, ignoring...');
	}
	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message: ', error);
			return;
		}
	}

	if (user.bot || user.id == author.id) return;

	if (reaction.message.id != gameMessage.id) {
		return console.log('Wrong message. ignoring...');
	}

	let userToRemove = listJoueurs.find(userInList => userInList === user.username);
	if (userToRemove) {
		// user dans la liste, on remove...
		console.log('User in list, removing...');
		try {
			let role = reaction.message.guild.roles.find(r => r.name === "joueurDuSoir");
			let member = reaction.message.guild.members.find(r => r.id === user.id);
			member.removeRole(role);
			//role removed, updating list...
			listJoueurs.splice(listJoueurs.indexOf(user.username), 1);
			editEmbed(reaction.message);
		} catch (error) {
			console.log(error);
		}
	} else {
		try {
			reaction.message.channel.send("Vous n'êtes pas encore dans la liste des joueurs! (mais nous n'êtes même pas censé voir cette erreur)")
				.then(msg=> {
					msg.delete(5000);
				});
		} catch (error) {
			console.log(error);
		}
	}
});

//Création d'une sessions de jeu
function createGame(message, inputHeures, inputMinutes) {

	var emoji = '764917952600342539';
	var valid = cron.validate(`${inputMinutes} ${inputHeures} * * *`);
	console.log(`Cron format ?: ${valid}`);
	heures = inputHeures;
	minutes = inputMinutes;

	// check de l'heure pour plus de cohérence...
	var date = new Date();
	var embedTime = "";
	var dateH = date.getUTCHours()+2;
	if (dateH <= heures) {
		if (date.getMinutes() < minutes) {
			embedTime+="Ce ";
		} else {
			embedTime+="Demain ";
		}
	} else {
		embedTime+="Demain ";
	}
	if (heures >= 18 || embedTime < 3) {
		embedTime+= "soir";
	} else if (heures >= 14) {
		if (embedTime == "Ce ") {
			embedTime= embedTime.slice(0, -1); 
			embedTime+= "t aprèm";
		} else  {
			embedTime+= "aprèm";
		}
	} else if (embedTime >= 12) {
		embedTime+= "midi";
	} else {
		embedTime+= "matin";
	}

	//création de l'embed
	try {
		var embed = new Discord.RichEmbed();
		
		embed.setColor(getHexa());
		embed.setAuthor(`${message.author.username} propose de jouer`, `${message.author.displayAvatarURL}`);
		embed.addField(`${embedTime} à:`,`${heures}h${minutes}`, true);
		embed.addField(`Places restantes:`,`9`, true);
		embed.setImage(`https://i.imgur.com/8sd2fgo.png`);
		embed.setFooter(`Réagissez en dessous pour participer`);
	} catch (error) {
		message.channel.send(`Erreur lors de la création de l'embed.`)
			.then(msg=> {
				msg.delete(5000);
			});
	}

	//tout est good on post l'embed
	try {
		message.channel.send(embed)
			.then(embedMessage => {
				embedMessage.react(emoji);
				gameMessage = embedMessage;
			});
		author = message.author;

		// c'est ok, on ajoute le rôle à l'auteur..
		let role = message.guild.roles.find(r => r.name === "joueurDuSoir");
		let member = message.guild.members.find(r => r.id === message.author.id);
		member.addRole(role);

		// on lance cron.
		task.start();
		gameSheduled = true;
		console.log(`Game sheduled ?: ${gameSheduled}`);
		//delete l'ancienne game si elle existe...
		// delOldGame();
	} catch (error) {
		console.log(error);
		message.channel.send('missing permissions to react or send embed')
			.then(msg=> {
				msg.delete(5000);
			});
	}
	try {
		message.delete();
	} catch (error) {
		console.log(error);
		message.channel.send('missing permissions to delete author message')
			.then(msg=> {
				msg.delete(5000);
			});
	}
}

// edition des embeds pour mise à jour de la liste de joueurs
function editEmbed(message) {
	var listToString ="";
	for (let i = 0; i < listJoueurs.length; i++) {
		if (listJoueurs.length > 1) {
			if (i >= listJoueurs.length-1) {
				//on remove ", "
				listToString = listToString.slice(0, -2);
				// et on met le dernier élément à la place 
				listToString+=` et ${listJoueurs[i]}.`;
			} else {
				listToString+=`${listJoueurs[i]}, `;
			}			
		} else {
			listToString+=`${listJoueurs[i]}.`;
		}
	}
	try {
		var embed = new Discord.RichEmbed(message.embeds[0])
		embed.fields = [];
		embed.addField(`Ce soir à:`,`${heures}h${minutes}`, true);
		if (listJoueurs.length) {
			embed.setDescription(`avec: ${listToString}`);
			let NbofJoueurs = 9 - listJoueurs.length;		
			embed.addField(`Places restantes:`,`${NbofJoueurs}`, true);
		} else {
			embed.setDescription(``);
			embed.addField(`Places restantes:`,`9`, true);
		}
		message.edit(embed);
	} catch (error) {
		console.log(error);
	}

}

//suppression de la session de jeu après le timer.
function deleteGame() {
	console.log('suppression de la partie en court...');
	var msg = gameMessage.channel.send(`Suppression de la partie...`)
		.then(msg=> {
			msg.delete(3000);
		});

	// on arrête cron
	console.log('stoping cron shedule..');
	task.stop();
	
	// on vire le role à tout les joueurs
	try {
		
		// on retire le rôle à toute la liste de joueurs:
		listJoueurs.forEach(joueurs => {
			let role = gameMessage.guild.roles.find(r => r.name === "joueurDuSoir");
			let member = gameMessage.guild.members.find(r => r.user.username === joueurs);
			member.removeRole(role);
		});
		
		// puis à l'auteur de la partie:
		let role = gameMessage.guild.roles.find(r => r.name === "joueurDuSoir");
		let member = gameMessage.guild.members.find(r => r.id === author.id);
		member.removeRole(role);
	} catch (error) {
		gameMessage.channel.send("Erreur lors de la suppression du rôles au joueurs!")
		.then(msg=> {
			msg.delete(5000);
		});
		console.log(error);
	}
		
	try {
		gameMessage.channel.send(`Suppression terminé!`)
		.then(msg2=> {
			msg2.delete(3000);
		});
	} catch (error) {
		console.log(error);
		gameMessage.channel.send("Erreur lors de la suppression des message!")
		.then(msg=> {
			msg.delete(5000);
		});
	}
	// on log la game
	// logOldGame(pingMsg);
	//puis on reset les variables dans la fonction
	gameMessage.delete();
	setGlobales();
	// setTimeout(() => {  pingMsg.delete(); }, 60000);
	pingMsg = new Discord.Message();
	return 0;
}

// définition / reset des variables globales
function setGlobales() {
	gameSheduled = false;
	gameMessage = new Discord.Message();
	author = new Discord.User();
	listJoueurs = [];
	heures = 0;
	minutes = 0;
}

function logOldGame(pingMsg) {
	console.log('on log les obj');
	oldGame = gameMessage;
	oldPingMsg = pingMsg;
}

function delOldGame() {
	if (typeof oldGame === 'undefined') {
		//première game, pas de log à delete, on crée les obj
		oldGame = new Discord.Message();
		oldPingMsg = new Discord.Message();
		return 0;
	} else {
		oldGame.delete();
		oldPingMsg.delete();
		oldGame = new Discord.Message();
		oldPingMsg = new Discord.Message();
	}
}

async function sleep(ms) {
	try {
		await sleep(ms);
	} catch (error) {
		console.log(error);
	}
}

// random hexa
function getHexa() {
	return '#'+Math.floor(Math.random()*16777215).toString(16);
}

// random function
function getRandom(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min +1)) + min;
}

connect.login(client);