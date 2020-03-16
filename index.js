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
		if (args !== null && args !== '') console.log(`With argu ${args}`);
	

	try {

		// ping
		if (command === "ping") {
			message.channel.send("pong");
			var embed = new Discord.RichEmbed();
			embed.setColor('#FFFFFF');
			const m = await message.channel.send("Ping?");
			embed.setAuthor(`${message.author.username} -> ping`, `${message.author.displayAvatarURL}`);
			embed.addField(`Pong! (${m.createdTimestamp - message.createdTimestamp}ms).`,`Latence API: ${Math.round(client.ping)}ms.`);
			// message.delete();
			// m.delete();
			message.channel.send(embed);
		}

		// addme
		if (command === "addme") {
			message.reply('https://discordapp.com/oauth2/authorize?client_id=689215093501591553&permissions=3072&scope=bot');
		}
	} catch (error) {
		console.log(error);
	}
	
});

 

// THIS  MUST  BE  THIS  WAY

client.login(process.env.BOT_TOKEN);//BOT_TOKEN is the Client Secret