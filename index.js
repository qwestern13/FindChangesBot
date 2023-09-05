const dotenv = require('dotenv');
const TelegramApi = require('node-telegram-bot-api');
dotenv.config();
const token = process.env.TOKEN;



const bot = new TelegramApi(token, {polling: true});
const chatId = '-912943656';

bot.sendMessage(chatId, 'hello');
