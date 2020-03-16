const Discord = require('discord.js');

const client = new Discord.Client();
const config = require("./config.json");
 

client.on('ready',async m => {
	console.log(`logged in as ${client.user.tag}, in ${client.channels.size} channels of ${client.guilds.size} server.`);
	//client.user	.setActivity(`C'est pas les vacances!`)	
});

 

client.on('message', async message => {
	
	if (!message.content.startsWith(config.prefix) || message.author.bot) return;
		const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();
		console.log(`Command ${command} by ${message.author.username}#${message.author.discriminator} in '${message.guild}' at ${message.createdAt}`);
		if (args) console.log(`With argu ${args}`);

// help
	if (command === "help") {
		const help = require("./help.json");
		var prefix=config.prefix+" ";
		var helpHeader="```css\n";
		var helpTitle;
		var helpBody;
		var helpFooter="\n```";
		switch (`${args}`) {
			case '2':
				helpTitle=help.p2.Title+"\t[2/3]\n\n";
				helpBody=help.p2.body;
				helpFooter="\n\n\t"+prefix+" {help 3} pour les commandes Admins```";
			 break;

			case '3':
				helpTitle=help.p3.Title+"\t[3/3]\n\n";
				helpBody=help.p3.body;
			 break;
			
			case '1':
			default:
				helpTitle=help.p1.Title+"\t[1/3]\n\n";
				helpBody=help.p1.body;
				if (!`${args}`) 	helpFooter="\n\n\t"+prefix+" {help 2} pour les commandes Randoms```";
			 break;
		}
		message.channel.send(helpHeader+helpTitle+helpBody+helpFooter);
	}

// addme
	if (command === "addme") {
		message.reply('https://discordapp.com/oauth2/authorize?client_id=689215093501591553&permissions=3072&scope=bot');
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
});

 

// THIS  MUST  BE  THIS  WAY

client.login(process.env.BOT_TOKEN);//BOT_TOKEN is the Client Secret