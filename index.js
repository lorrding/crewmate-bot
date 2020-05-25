const Discord = require('discord.js');

const client = new Discord.Client();
const config = require("./config.json");
const cron = require('node-cron');


client.on('ready',async m => {
	console.log(`logged in as ${client.user.tag}, in ${client.channels.size} channels of ${client.guilds.size} server.`);
	client.user.setPresence({
		game: {
			name: 'C\'est pas les vacances! https://youtu.be/dQw4w9WgXcQ',
			type: "PLAYING",
			url: "https://youtu.be/dQw4w9WgXcQ"
		},
		status: 'idle' 
		})
  		.catch(console.error);
});

const eci = {role:"<@&604658459799191555>", channel:"689193168805036172"};
const dw = {role:"<@&604658418980093993>", channel:"689193318743015429"};
const PremAnnee = {role:"<@&707150218629611560>", channel:"588799647137398807"};
const iut = {general:"588798225092313094", meme:"651493260694650912"};
const listVideo = ["https://youtu.be/dQw4w9WgXcQ","https://youtu.be/qWpBduQKTMY","https://youtu.be/QH2-TGUlwu4","https://youtu.be/XCiDuy4mrWU","https://youtu.be/L_jWHffIx5E","https://youtu.be/RAP0fzBsjQk"];
var timer = 0;

//deja vu https://youtu.be/dv13gl0a-FA

try {
	// cron.schedule('*/59 * * * *', () => {
	// 	timer++;
	// 	if(timer >=17) {
	// 		timer=0;
	//		console.log(`j'ai balancé une vidéo`);
	// 		client.channels.get(`${PremAnnee.channel}`).send(`${listVideo[getRandom(0,listVideo.length)]}`);
	// 	}
	// }, {
	// 	scheduled: true,
	// 	timezone: "Europe/Riga"
	// });


	// //LUNDI
	// 	//9h
	// 	cron.schedule('50 8 * * mon', () => {
	// 		client.channels.get(`${PremAnnee.channel}`).send(`PTS/Autonomie, dans 10 minutes!`);
	// 	}, {
	// 		scheduled: true,
	// 		timezone: "Europe/Riga"
	// 	});
	// 	//10h30
	// 	// cron.schedule('20 10 * * mon', () => {
	// 	// 	client.channels.get(`${PremAnnee.channel}`).send(`${PremAnnee.role}, dans 10 minutes!`);
	// 	// }, {
	// 	// 	scheduled: true,
	// 	// 	timezone: "Europe/Riga"
	// 	// });
		
		//14h
		cron.schedule('40 13 * * mon', () => {
		client.channels.get(`${PremAnnee.channel}`).send(`${PremAnnee.role}, CS de BD, dans 20 minutes! (Allez sur Discord dès maintenant)`);
		}, {
			scheduled: true,
			timezone: "Europe/Riga"
		});
		
		// 15h00
		// cron.schedule('20 15 * * mon', () => {
		// 	client.channels.get(`${PremAnnee.channel}`).send(`${PremAnnee.role}, dans 10 minutes!`);
		// }, {
		// 	scheduled: true,
		// 	timezone: "Europe/Riga"
		// });
	
	
	// // // MARDI 
	// 	//9h
		cron.schedule('50 8 * * tues', () => {
			client.channels.get(`${PremAnnee.channel}`).send(`${PremAnnee.role}, AMN dans 10 minutes! (sur Moodle + RocketChat)`);
		}, {
			scheduled: true,
			timezone: "Europe/Riga"
		});
	
	// 	//10h30
		cron.schedule('20 10 * * tues', () => {
			client.channels.get(`${PremAnnee.channel}`).send(`${PremAnnee.role}, ANG dans 10 minutes!`);
		}, {
			scheduled: true,
			timezone: "Europe/Riga"
		});
		
	// 	//14h
		cron.schedule('50 13 * * tues', () => {
			client.channels.get(`${PremAnnee.channel}`).send(`PTS / Autonomie dans 10 minutes!`);
		}, {
			scheduled: true,
			timezone: "Europe/Riga"
		});
		
	// 	//15h30
		cron.schedule('20 15 * * tues', () => {
			client.channels.get(`${PremAnnee.channel}`).send(`${PremAnnee.role}, SI dans 10 minutes!`);
		}, {
			scheduled: true,
			timezone: "Europe/Riga"
		});
	
	
	// MERCREDI 
		//9h
		cron.schedule('50 8 * * wed', () => {
			client.channels.get(`${PremAnnee.channel}`).send(`${PremAnnee.role}, ECJS dans 10 minutes!`);
		}, {
			scheduled: true,
			timezone: "Europe/Riga"
		});
	
		//10h30
		cron.schedule('20 10 * * wed', () => {
			client.channels.get(`${PremAnnee.channel}`).send(`${PremAnnee.role}, EC dans 10 minutes (encore)!`);
		}, {
			scheduled: true,
			timezone: "Europe/Riga"
		});
		
		//14h
		cron.schedule('50 13 * * wed', () => {
			client.channels.get(`${PremAnnee.channel}`).send(`${PremAnnee.role}, GPI dans 10 minutes!`);
		}, {
			scheduled: true,
			timezone: "Europe/Riga"
		});
		
		//15h30
		cron.schedule('20 15 * * wed', () => {
			client.channels.get(`${PremAnnee.channel}`).send(`GPI/PTS dans 10 minutes!`);
		}, {
			scheduled: true,
			timezone: "Europe/Riga"
		});
	
	
	// JEUDI
		//9h
		cron.schedule('50 8 * * thu', () => {
			client.channels.get(`${PremAnnee.channel}`).send(`${PremAnnee.role}, LAN dans 10 minutes! (moodle + Discord)`);
		}, {
			scheduled: true,
			timezone: "Europe/Riga"
		});
	
		//10h30
		cron.schedule('20 10 * * thu', () => {
			client.channels.get(`${PremAnnee.channel}`).send(`${PremAnnee.role}, LAN dans 10 minutes! (toujours sur moodle + Discord)`);
		}, {
			scheduled: true,
			timezone: "Europe/Riga"
		});
		
		//14h
		cron.schedule('50 13 * * thu', () => {
			client.channels.get(`${PremAnnee.channel}`).send(`Travail perso en IHM dans 10 minutes!`);
		}, {
			scheduled: true,
			timezone: "Europe/Riga"
		});
		
		// 15h30
		cron.schedule('20 15 * * thu', () => {
			client.channels.get(`${PremAnnee.channel}`).send(`PTS / Autonomie dans 10 minutes!`);
		}, {
			scheduled: true,
			timezone: "Europe/Riga"
		});
	
	
	// VENDREDI
		//9h
		cron.schedule('50 8 * * fri', () => {
			client.channels.get(`${PremAnnee.channel}`).send(`${PremAnnee.role}, CS d'AMN dans 10 minutes (moodle + RocketChat)!`);
		}, {
			scheduled: true,
			timezone: "Europe/Riga"
		});
	
		//10h30
		cron.schedule('20 10 * * fri', () => {
			client.channels.get(`${PremAnnee.channel}`).send(`${PremAnnee.role}, IHM dans 10 minutes!`);
		}, {
			scheduled: true,
			timezone: "Europe/Riga"
		});
		
		//14h
		cron.schedule('50 13 * * fri', () => {
			client.channels.get(`${PremAnnee.channel}`).send(`${PremAnnee.role}, on retourne en IHM dans 10 minutes!`);
		}, {
			scheduled: true,
			timezone: "Europe/Riga"
		});
		
		// 15h30
		cron.schedule('20 15 * * fri', () => {
			client.channels.get(`${PremAnnee.channel}`).send(`Autonomie dans 10 minutes!`);
		}, {
			scheduled: true,
			timezone: "Europe/Riga"
		});
		
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
		message.channel.send("> /edt");
		message.channel.send("pour voir l'emploi du temps de la semaine");
		message.channel.send('<:lording:689477945970130994>');
	}

// planning
	if (command === "edt") {
		message.channel.send({file: "https://i.imgur.com/SYdQ79v.png"});
	}

// àrendre
	if (command === "afaire") {
		const now = Date.now();
		const AMN = Date.parse('26 May 2020 09:00:00 UTC+2');
		const ANG = Date.parse('26 May 2020 10:30:00 UTC+2');
		const PTS = Date.parse('4 June 2020 15:30:00 UTC+2');
		const csAMN = Date.parse('29 May 2020 09:00:00 UTC+2');

		const semaineSuivante = Date.parse('26 May 2020 09:00:01 UTC+2');

		var auMoinsUn = false;
		var embed = new Discord.RichEmbed();
		embed.setTitle(`Échéances / Devoir à rendre`);
		embed.setColor(getHexa());

		if(AMN - now > 0 ) {
			auMoinsUn=true;
			embed.addField(`Pour Mardi avant 9h`,`Préparation de la séance d'AMN (environ 1h)`);
		}
		if(ANG - now > 0 ) {
			auMoinsUn=true;
			embed.addField(`Pour Mardi avant 10h30`,`Préparation de la séance d'ANG (+ environ 1h de travail à faire dans la semaine)`);
		}
		if(PTS - now > 0 ) {
			auMoinsUn=true;
			embed.addField(`Pour la semaine suivante`,`Remise de PTS (cahier des charges)`);
		}
		if(csAMN - now > 0 ) {
			auMoinsUn=true;
			embed.addField(`Cs d'AMN le vendredi 29 mai à 9h`,`remise du cs sur moodle (et RocketChat je suppose)`);
		}
		if (!auMoinsUn) {
			embed.addField(`Il n'y à riens à faire`,`Wouhouu`);
		} 	
		message.channel.send(embed);
		delete(embed);
	}
	
});

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
