require('dotenv').config();
const wakeUpDyno = require("wakeDyno.js");

const Discord = require("discord.js")

const bot = new Discord.Client();
const TOKEN = process.env.BOT_TOKEN;

bot.login(TOKEN);

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('pong2');
        msg.channel.send('pong2');

    }
});
