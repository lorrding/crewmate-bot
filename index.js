const Discord = require('discord.js');

const client = new Discord.Client();
const config = require("./config.json");
const cron = require('node-cron');

gameSheduled = false;
gameMessage = new Discord.Message();
author = new Discord.User();
//grantedRole = new Discord.Role();
// gameChannel = "767812168745484328";
listJoueurs = [];
heures = 0;
minutes = 0;


client.on('ready',async m => {
	console.log(`logged in as ${client.user.tag}, in ${client.channels.size} channels of ${client.guilds.size} server.`);
	client.user.setActivity("Among Us", {
		type: "STREAMING",
		url: "https://youtu.be/dQw4w9WgXcQ"
	});
});


try {
	// cron shedule
	cron.schedule(`* * * * *`, () => {
		if (gameSheduled) {
			let d = new Date();
			var h = d.getUTCHours()+2;
			var m = d.getMinutes();
			if (h == heures && m == minutes) {
				gameMessage.channel.send(`<@&767870145091600405>, c'est l'heure!`);
				// client.channels.get(gameChannel).send(`<@&767870145091600405>, c'est l'heure!`);
				console.log('NOW!!!!!!');
				return deleteGame();
			}
		}
	}, {
		scheduled: true,
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


// game
	if (command === "game") {
		if (!args.length) {
			message.channel.send("Arguments manquant!\n```-h | --heure -> paramétrage de l'heure\n-d | --delete -> suppression de la game en court```")
				.then(msg=> {
					msg.delete(5000);
				});
			return message.delete();
		}
		// if (message.member.roles.highest.comparePositionTo(message.guild.roles.find(t => t.name == 'Trusted player'))) {
		if (message.member.hasPermission('SEND_MESSAGES')) {
			console.log('role : checked');
		}

		args.forEach(function(element, index) {
			// paramétrage de l'heure
			if (element == "-h" || element == "--heure") {
				if (gameSheduled) {
					message.channel.send(`Une game est déjà prévu!`)
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
					message.channel.send("Format d'heure invalide \nL'heure doit être sous la forme ```0-23:0-60```")
						.then(msg=> {
							msg.delete(5000);
						});
					return message.delete();
				}
				console.log(`format d'heure valide`);
				if (time.search("h")) {
					time = time.split("h");	
				} else {
					time = time.split(":");
				}
				let tempHeures = time.shift();
				let tempMinutes = time.shift();
				createGame(message, tempHeures, tempMinutes);
				return 0;
			}

			if (element == "-d" || element == "--delete") {
				console.log('delete...');
			}
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
		message.channel.send("Work in progress");
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
	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			throw console.error('Something went wrong when fetching the message: ', error);
		}
	}

	if (user.bot) return;

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

	if (reaction.message.id != gameMessage.id) {
		return console.log('Wrong message. ignoring...');
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
			throw console.log(error);
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
	console.log(`valid cron format ?: ${valid}`);
	heures = inputHeures;
	minutes = inputMinutes;

	//création de l'embed
	try {
		var embed = new Discord.RichEmbed();
		
		embed.setColor(getHexa());
		embed.setAuthor(`${message.author.username} propose de jouer`, `${message.author.displayAvatarURL}`);
		embed.addField(`Ce soir à:`,`${heures}h${minutes}`, true);
		embed.addField(`Places restantes:`,`${10-listJoueurs.length}`, true);
		embed.setImage(`https://i.imgur.com/DrX4YVO.png`);
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
		gameSheduled = true;
		console.log(`Game sheduled ?: ${gameSheduled}`);
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
				listToString+=`et ${listJoueurs[i]}.`;
			} else {
				listToString+=`${listJoueurs[i]}, `;
			}			
		} else {
			listToString+=`${listJoueurs[i]}.`;
		}
	}
	try {
		var embed = new Discord.RichEmbed(message.embeds[0])
		if (listJoueurs.length) {
			embed.setDescription(`avec: ${listToString}`);			
		} else {
			embed.setDescription(``);
		}
		console.log(message.embeds[0]);
		console.log(message.embeds[0]);
		// embed.addField(`Places restantes:`,`${10-listJoueurs.length}`, true);
		message.edit(embed);
	} catch (error) {
		console.log(error);
	}

}

//suppression de la session de jeu après le timer.
function deleteGame() {
	if (message.member.roles.highest.comparePositionTo(message.guild.roles.find(t => t.name == 'Trusted player'))) {
		console.log('role : checked');
	}
	gameMessage.channel.send(`Delete de game: work in progess`);
	// client.channels.get(gameChannel).send(`Delete de game: work in progess`);
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

client.login(process.env.BOT_TOKEN);
