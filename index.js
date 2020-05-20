require('dotenv').config();

const util = require("./util");
console.log(util.Times.name);
// db

const db = util.Database;
console.log(db);
console.log(db.getRows("select * from times;") == undefined);

// db

const Discord = require("discord.js")

const bot = new Discord.Client();

const TOKEN = process.env.DEV == "true" ? process.env.TEST_BOT : process.env.BOB_BOT;

const adminId = "445907614480728065";

const config = {
	prefix: "--",
}

let timesChannels = {
	"shit-talk": undefined,
	"bot-channel": undefined,
};

const commands = {
	start: { func: util.Times.start,
			 whitelist: timesChannels,
		},
	stop: { func: util.Times.stop,
			whitelist: timesChannels,
		},
}

bot.login(TOKEN);

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
    
	// loops through each server the bot is in
    for (let [key, value] of bot.guilds) {
		//loops through each channel the bot is in
    	for (let [channelId, channel] of value.channels) {
    		// loops through each command
			for (let cmd in commands) {
				let wl = commands[cmd].whitelist;
				// if cmd is in the whitelist
				if (channel.name in wl) {
					// bind channelId to channel name
					commands[cmd].whitelist[channel.name] = channelId;
				}
			}
   	 }
    }
    console.log(timesChannels);
});

bot.on('message', msg => {
	
	// don't reply to other bots
	if (msg.author.bot) {
		return;
	}
	
	// get the message text
	let content = msg.content;
	
	// return if the message does not start with the prefix
	if (!content.startsWith(config.prefix)) {
		return;
	}
	
	// remove the prefix
	content = content.slice(config.prefix.length).trim();
	
	// split content by spaces
	let args = content.split(/ +/);
	
	// get message author
	let author = msg.author;
	
	//console.log(msg.content.split(Discord.MessageMentions.USERS_PATTERN));
	
	/*
	if (msg.mentions.users.has(bot.user.id)) {
		console.log("mention");
	}
	*/
	
	// if help command sent
	if (args[0] == "help") {
		// if help has arguments
		if (args.length > 1) {
			// send command specific help
			if (args[1] in commands) {
				let reply = "Command '" + args[1] + "':\n";
				reply += "\tDesc: " + commands[args[1]].desc + "\n";
				reply += "\tUsage: "+ commands[args[1]].usage;
				msg.channel.send(reply);
			} else { // invalid command
				msg.channel.send("'" + args[1] + "' is not a command");
			}
			return;
		} else { // show help for all commands
			msg.channel.send("help all commands");
		}
	}

	if (args[0] in commands) {
		// if the command has a channel whitelist
		if (commands[args[0]].whitelist) {
			// if the channel is not in the whitelist then return
			if (!Object.values(commands[args[0]].whitelist).includes(msg.channel.id)) {
				return;
			}
		}

		let missingArgs;
		// does the command require extra args
		if (commands[args[0]].params) {
			// is there less than the minimum amount of args
			if (args.length - 1 < commands[args[0]].params) {
				// calculates the number of missing args
				missingArgs = commands[args[0]].params - (args.length - 1);
				/* reword this */
				msg.reply("The command '" + args[0] + "' requires " + commands[args[0]].params + " arguments, (only " + (args.length -1) + " were given");
				return;
			}
		}

		//if the command requires admin
		if (commands[args[0]].admin) {
			// is the author admin
			if (author.id == adminId) {
				commands[args[0]].func(msg, args, context);
			} else {
				msg.reply("You do not have permission to use the command '" + args[0] + "'");
			}
		} else { // command does not require admin
			commands[args[0]].func(msg, args, content);
		}
	} else { // not a valid command
		msg.reply("Invalid command!");
	}

    // msg.channel.send() without @
});
