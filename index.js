const Discord = require('discord.js');

const client = new Discord.Client();
const config = require("./config.json");
const cron = require('node-cron');

let gameMessage = 0;
let listJoueurs = [];


client.on('ready',async m => {
	console.log(`logged in as ${client.user.tag}, in ${client.channels.size} channels of ${client.guilds.size} server.`);
	client.user.setActivity("Among Us", {
		type: "STREAMING",
		url: "https://youtu.be/dQw4w9WgXcQ"
	  });
});

try {
	// cron exemple
	// 	cron.schedule('50 8 * * mon', () => {
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


// test
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
			console.error('Something went wrong when fetching the message: ', error);
			return;
		}
	}
	if (user.bot || reaction.message.id != gameMessage.id) {
		console.log(`id du message réagis: ${reaction.message.id} //// id du message de base ${gameMessage.id}`);
	}

	if (listJoueurs.size <10) {
		console.log('taille de joueurs: ok, on insert');
		listJoueurs.push(user.username);
		message.channel.send(`liste des joueurs: ${listJoueurs}`);
	}

	

	reaction.message.channel.send(`${user.username} à ajouter une réaction`);

	// Now the message has been cached and is fully available
	console.log(`${reaction.message.author}'s message "${reaction.message}" gained a reaction!`);
	// The reaction is now also fully available and the properties will be reflected accurately:
	console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
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
		embed.setDescription(`Avec: ${joueurs}`);
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
				console.log(`embedMessage.id ${embedMessage.id}, gameMessage ${gameMessage}`);
			})
	} catch (error) {
		console.log(error);
		message.channel.send('missing permissions to react or send embed');	
	}
	try {
		message.delete();
	} catch (error) {
		console.log(error);
		message.channel.send('missing permissions to delete command');
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

 
client.login(process.env.BOT_TOKEN);
