const Discord = require('discord.js');

const client = new Discord.Client();
const config = require("./config.json");
const cron = require('node-cron');

gameMessage = 0;
listJoueurs = [];
author = 0;
heure = 0;


client.on('ready',async m => {
	console.log(`logged in as ${client.user.tag}, in ${client.channels.size} channels of ${client.guilds.size} server.`);
	client.user.setActivity("Among Us", {
		type: "STREAMING",
		url: "https://youtu.be/dQw4w9WgXcQ"
	  });
});

try {

	// cron exemple
	// 	cron.schedule(`${minutes} ${heures} * * *`, () => {
	// 		client.channels.get(`${PremAnnee.channel}`).send(`PTS/Autonomie, dans 10 minutes!`);
	// 	}, {
	// 		scheduled: true,
	// 		timezone: "Europe/Riga"
	// 	});
	} catch (error) {
		let date_ob = new Date();
		let date = ("0" + date_ob.getDate()).slice(-2);
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
	if (command === "test") {
		if (!args.length) {
			return message.channel.send(`Il manque des arguments pour créer l'évenement!`);
		}
		args.forEach(function(element, index) {
			// paramétrage de l'heure
			if (element == "-h" || element == "-heure") {
				if (index >= args.length-1) {
					return message.channel.send(`Il manque l'heure de le la session de jeu!`);
				}
				var argument = args.shift();
				var heure = args.shift();
				createGame(message, heure);
				return 0;
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

	//Mauvaise réaction
	console.log(`réaction.id : ${reaction.id}, réaction to match: 764917952600342539`);
	// if (reaction.id != "764917952600342539") return;

	// si c'est l'auteur du message, on ignore
	if(user.id == author) {
		reaction.message.channel.send("La personne qui propose de jouer est déjà dans la liste des joueurs, pas besoin de réagir au message!");
		reaction.remove(user);
		return console.log('author already un list, ignoring...');
	}

	if (reaction.message.id != gameMessage) {
		return console.log('Wrong message. ignoring...');
	}

	if (listJoueurs.length >= 10) {
		reaction.message.channel.send("Nombre de joueurs max atteint!");
		reaction.message.channel.send("<:AU_why:765273043962298410>");
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
				reaction.message.channel.send("Vous êtes déjà dans la liste des joueurs! (mais nous n'êtes même pas censé voir cette erreur)");
			} catch (error) {
				console.log(error);
			}
			return console.log('user already un list, ignoring...');
		}
	}
	
	//tout les if sont passé, c'est good
	// ajout dans la liste + ajout du role
	try {
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

	if (user.bot || user.id == author) return;

	if (reaction.message.id != gameMessage) {
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
			reaction.message.channel.send("Vous n'êtes pas encore dans la liste des joueurs! (mais nous n'êtes même pas censé voir cette erreur)");
		} catch (error) {
			console.log(error);
		}
	}
});

//Création d'une sessions de jeu
function createGame(message, heure) {
	var joueurs = `work in progress`;
	var emoji = '764917952600342539';

	//création de l'embed
	try {
		var embed = new Discord.RichEmbed();
		
		embed.setColor(getHexa());
		embed.setAuthor(`${message.author.username} propose de jouer`, `${message.author.displayAvatarURL}`);
		embed.addField(`Ce soir à:`,`${heure}`);
		embed.setFooter(`Réagissez en dessous pour participer`);
	} catch (error) {
		message.channel.send(`Erreur lors de la création de l'embed.`);
	}

	//tout est good on post l'embed
	try {
		message.channel.send(embed)
			.then(embedMessage => {
				embedMessage.react(emoji);
				gameMessage = embedMessage.id;
			});
		author = message.author.id;
		// c'est ok, on ajoute le rôle à l'auteur..
		let role = message.guild.roles.find(r => r.name === "joueurDuSoir");
		let member = message.guild.members.find(r => r.id === message.author.id);
		member.addRole(role);
		// noice
	} catch (error) {
		console.log(error);
		message.channel.send('missing permissions to react or send embed');	
	}
	try {
		message.delete();
	} catch (error) {
		console.log(error);
		message.channel.send('missing permissions to delete message');
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
		if (listJoueurs.length) {
			let embed = new Discord.RichEmbed(message.embeds[0])
			.setDescription(`avec: ${listToString}`);			
		} else {
			let embed = new Discord.RichEmbed(message.embeds[0])
			.setDescription(``);
		}
		message.edit(embed);
	} catch (error) {
		console.log(error);
	}

}

//suppression de la session de jeu après le timer.
function deleteGame(message) {
	listJoueurs.forEach(user => {
		console.log('mehs');
	});
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
