const Discord = require('discord.js');

const client = new Discord.Client();
const config = require("./config.json");
const cron = require('node-cron');


const guild = client.guilds.get("261492016251142146");
const role = guild.roles.find("name", "lvl59");
console.log(`Found the role ${role.name}`);

client.on('ready',async m => {
	console.log(`logged in as ${client.user.tag}, in ${client.channels.size} channels of ${client.guilds.size} server.`);
	client.user	.setActivity(`C'est pas les vacances!`)	
});

// ECI
	//ANG
	//cron.schedule('20 10 * * tues', () => {
	cron.schedule('*/2 * * * tues', () => {
		console.log('ECI->MPE');

		console.log(role.id);
		client.channels.get("689216081276960863").send(`Rappel, <@&${role.id}> MPE dans 10 minutes!`);
	}, {
		scheduled: true,
		timezone: "Europe/Paris"
	});


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

// addme
	if (command === "addme") {
		message.reply('https://discordapp.com/oauth2/authorize?client_id=689215093501591553&permissions=3072&scope=bot');
	}
	
});

 
client.login(process.env.BOT_TOKEN);
