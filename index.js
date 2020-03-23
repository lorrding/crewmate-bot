const Discord = require('discord.js');

const client = new Discord.Client();
const config = require("./config.json");
const cron = require('node-cron');


client.on('ready',async m => {
	console.log(`logged in as ${client.user.tag}, in ${client.channels.size} channels of ${client.guilds.size} server.`);
	client.user.setPresence({
		game: {
			name: 'C\'est pas les vacances!',
			type: "STREAMING",
			url: "https://youtu.be/dQw4w9WgXcQ"
		},
		status: 'idle' 
		})
  		.then(console.log)
  		.catch(console.error);
});

const eci = {role:"<@&604658459799191555>", channel:"689193168805036172"};
const dw = {role:"<@&604658418980093993>", channel:"689193318743015429"};
const PremAnnee = {role:"<@&604658039189929994>", channel:"588799647137398807"};
const iut = {general:"588798225092313094", meme:"651493260694650912"};

try {
	// LUNDI
		//9h
		// cron.schedule('50 8 * * mon', () => {
		// 	client.channels.get(`${PremAnnee.channel}`).send(`${PremAnnee.role}, dans 10 minutes!`);
		// 	client.channels.get(`${eci.channel}`).send(`${eci.role}, dans 10 minutes!`);
		// 	client.channels.get(`${dw.channel}`).send(`${dw.role}, dans 10 minutes!`);
		// }, {
		// 	scheduled: true,
		// 	timezone: "Europe/Paris"
		// });
	
		// //10h30
		// cron.schedule('20 10 * * mon', () => {
		// 	client.channels.get(`${PremAnnee.channel}`).send(`${PremAnnee.role}, dans 10 minutes!`);
		// 	client.channels.get(`${eci.channel}`).send(`${eci.role}, dans 10 minutes!`);
		// 	client.channels.get(`${dw.channel}`).send(`${dw.role}, dans 10 minutes!`);
		// }, {
		// 	scheduled: true,
		// 	timezone: "Europe/Paris"
		// });
		
		// //14h
		// cron.schedule('50 13 * * mon', () => {
		// 	client.channels.get(`${PremAnnee.channel}`).send(`${PremAnnee.role}, dans 10 minutes!`);
		// 	client.channels.get(`${eci.channel}`).send(`${eci.role}, dans 10 minutes!`);
		// 	client.channels.get(`${dw.channel}`).send(`${dw.role}, dans 10 minutes!`);
		// }, {
		// 	scheduled: true,
		// 	timezone: "Europe/Paris"
		// });
		
		// //15h30
		// cron.schedule('20 15 * * mon', () => {
		// 	client.channels.get(`${PremAnnee.channel}`).send(`${PremAnnee.role}, dans 10 minutes!`);
		// 	client.channels.get(`${eci.channel}`).send(`${eci.role}, dans 10 minutes!`);
		// 	client.channels.get(`${dw.channel}`).send(`${dw.role}, dans 10 minutes!`);
		// }, {
		// 	scheduled: true,
		// 	timezone: "Europe/Paris"
		// });
	
	
	// MARDI 
		//9h
		cron.schedule('50 8 * * tues', () => {
			client.channels.get(`${PremAnnee.channel}`).send(`${PremAnnee.role}, AMN dans 10 minutes!`);
		}, {
			scheduled: true,
			timezone: "Europe/Paris"
		});
	
		//10h30
		cron.schedule('20 10 * * tues', () => {
			client.channels.get(`${PremAnnee.channel}`).send(`${PremAnnee.role}, ANG dans 10 minutes!`);
			client.channels.get(`${eci.channel}`).send(`${eci.role}, MPE dans 10 minutes!`);	
		}, {
			scheduled: true,
			timezone: "Europe/Paris"
		});
		
		//14h
		cron.schedule('50 13 * * tues', () => {
			client.channels.get(`${PremAnnee.channel}`).send(`${PremAnnee.role}, GPI dans 10 minutes!`);
			client.channels.get(`${eci.channel}`).send(`${eci.role}, DEVOPS dans 10 minutes!`);	
		}, {
			scheduled: true,
			timezone: "Europe/Paris"
		});
		
		//15h30
		cron.schedule('20 15 * * tues', () => {
			client.channels.get(`${eci.channel}`).send(`${eci.role}, ADM dans 10 minutes!`);
		}, {
			scheduled: true,
			timezone: "Europe/Paris"
		});
	
	
	// MERCREDI 
		//9h
		cron.schedule('50 8 * * wed', () => {
			client.channels.get(`${PremAnnee.channel}`).send(`${PremAnnee.role}, ECJS dans 10 minutes!`);
			client.channels.get(`${dw.channel}`).send(`${dw.role}, DWS dans 10 minutes!`);
		}, {
			scheduled: true,
			timezone: "Europe/Paris"
		});
	
		//10h30
		cron.schedule('20 10 * * wed', () => {
			client.channels.get(`${PremAnnee.channel}`).send(`${PremAnnee.role}, EC dans 10 minutes!`);
			client.channels.get(`${eci.channel}`).send(`${eci.role}, MPM dans 10 minutes!`);
			client.channels.get(`${dw.channel}`).send(`${dw.role}, DWS/DEVOPS dans 10 minutes!`);
		}, {
			scheduled: true,
			timezone: "Europe/Paris"
		});
		
		//14h
		cron.schedule('50 13 * * wed', () => {
			client.channels.get(`${PremAnnee.channel}`).send(`${PremAnnee.role}, RES dans 10 minutes!`);
		}, {
			scheduled: true,
			timezone: "Europe/Paris"
		});
		
		//15h30
		cron.schedule('20 15 * * wed', () => {
			client.channels.get(`${eci.channel}`).send(`${eci.role}, ASE dans 10 minutes!`);
		}, {
			scheduled: true,
			timezone: "Europe/Paris"
		});
	
	
	// JEUDI
		//9h
		cron.schedule('50 8 * * thu', () => {
			client.channels.get(`${PremAnnee.channel}`).send(`${PremAnnee.role}, BD dans 10 minutes!`);
		}, {
			scheduled: true,
			timezone: "Europe/Paris"
		});
	
		//10h30
		cron.schedule('20 10 * * thu', () => {
			client.channels.get(`${PremAnnee.channel}`).send(`${PremAnnee.role}, BD dans 10 minutes!`);
			client.channels.get(`${eci.channel}`).send(`${eci.role}, ANG dans 10 minutes!`);
			client.channels.get(`${dw.channel}`).send(`${dw.role}, ANG dans 10 minutes!`);
		}, {
			scheduled: true,
			timezone: "Europe/Paris"
		});
		
		//14h
		cron.schedule('50 13 * * thu', () => {
			client.channels.get(`${PremAnnee.channel}`).send(`${PremAnnee.role}, LAN dans 10 minutes!`);
			client.channels.get(`${dw.channel}`).send(`${dw.role}, ASR dans 10 minutes!`);
		}, {
			scheduled: true,
			timezone: "Europe/Paris"
		});
		
		//15h30
		cron.schedule('20 15 * * thu', () => {
			client.channels.get(`${dw.channel}`).send(`${dw.role}, DEVMOB dans 10 minutes!`);
		}, {
			scheduled: true,
			timezone: "Europe/Paris"
		});
	
	
	// VENDREDI
		//9h
		cron.schedule('50 8 * * fri', () => {
			client.channels.get(`${PremAnnee.channel}`).send(`${PremAnnee.role}, BCOO dans 10 minutes!`);
			client.channels.get(`${eci.channel}`).send(`${eci.role}, ROC dans 10 minutes!`);
			client.channels.get(`${dw.channel}`).send(`${dw.role}, RO dans 10 minutes!`);
		}, {
			scheduled: true,
			timezone: "Europe/Paris"
		});
	
		//10h30
		cron.schedule('20 10 * * fri', () => {
			client.channels.get(`${PremAnnee.channel}`).send(`${PremAnnee.role}, POO dans 10 minutes!`);
			client.channels.get(`${eci.channel}`).send(`${eci.role}, EC dans 10 minutes!`);
			client.channels.get(`${dw.channel}`).send(`${dw.role}, EC dans 10 minutes!`);
		}, {
			scheduled: true,
			timezone: "Europe/Paris"
		});
		
		//14h
		cron.schedule('50 13 * * fri', () => {
			client.channels.get(`${dw.channel}`).send(`${dw.role}, PROGWEB dans 10 minutes!`);
		}, {
			scheduled: true,
			timezone: "Europe/Paris"
		});
		
		//15h30
		// cron.schedule('20 15 * * fri', () => {
		// 	client.channels.get(`${PremAnnee.channel}`).send(`${PremAnnee.role}, dans 10 minutes!`);
		// 	client.channels.get(`${eci.channel}`).send(`${eci.role}, dans 10 minutes!`);
		// 	client.channels.get(`${dw.channel}`).send(`${dw.role}, dans 10 minutes!`);
		// }, {
		// 	scheduled: true,
		// 	timezone: "Europe/Paris"
		// });	
} catch (error) {
	let date_ob = new Date();
	let date = ("0" + date_ob.getDate()).slice(-2);
	let hours = date_ob.getHours();
	let minutes = date_ob.getMinutes();

	client.channels.get(`689216081276960863`).send(`error at ${hours}:${minutes} \n${error}`);
}



client.on('message', async message => {
	
	if (!message.content.startsWith(config.prefix) || message.author.bot) return;
		const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();
		console.log(`Command ${command} by ${message.author.username}#${message.author.discriminator} in '${message.guild}' at ${message.createdAt}`);
		if (args) console.log(`With argu ${args}`);
	
// echo
	if (message.channel.id === "689472574081466369" && message.author.id === "224230450099519488") {
		console.log(`message by ${message.author.username}#${message.author.discriminator}, echo in IUT.`);
		console.log(message.content);
		client.channels.get(`${iut.general}`).send(`${message.content}`);
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
		message.channel.send("Le bot ping 10 minutes avant chaque début de cours pour chaque groupes (Eci/Dw/1erAnnee).");
		message.channel.send("Si c'est trop chiant pour certains je passerai les mentions en message privé et vous pourrez vous mettre un rôle (genre @CoronaMember) pour reçevoir les rappels.");
		message.channel.send("l'avenir de ce bot dépend du maitre des vieux");
		message.channel.send(">/ping");
		message.channel.send("pour voir la latence du bot");
		message.channel.send('<:lording:689477945970130994>');
	}

// planning
	if (command === "planning") {
		
	}
	
});

 
client.login(process.env.BOT_TOKEN);
