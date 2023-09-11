const dotenv = require('dotenv');
const TelegramApi = require('node-telegram-bot-api');
const request = require('request');
const iconv  = require('iconv-lite');
const fs = require("fs");

const opt = {
    url: 'https://www.webfoms.ru/document/document/',
    timeout: 5000,
    encoding: null,
    rejectUnauthorized: false,
    
}


dotenv.config();
const token = process.env.TOKEN;
const chatId = process.env.CHATID;
const bot = new TelegramApi(token, {polling: true});

request(opt, function (err, res, body) {
    if (err) throw err;

    let textFromReq = iconv.decode(body, 'utf-8');
    let lines = textFromReq.split('/n');
    let tmpLines = lines.splice(5).toString();
    fs.writeFile('data/dataYanao.txt', tmpLines, (err) => {
        if (err) {
          console.error(err)
          return
        }
        //файл записан успешно
      })
    console.log('ok');
    textIsEqual();  
    console.log(res.statusCode);
});


function textIsEqual() {
    fs.readFile('data/etalonYanao.txt', (err, data1) => {
        if (err) throw err;
        fs.readFile('data/dataYanao.txt', (err, data2) => {
         if (err) throw err;
         if (data1.equals(data2)) {
            bot.sendMessage(chatId, 'ЯНАО без изменений');
         } else {
            fs.writeFile('data/etalonYanao.txt', data2, (err) => {
                if (err) throw err;
                console.log('The file has been changed!');
              })
              bot.sendMessage(chatId, 'Были изменения в ЯНАО');
         }

        });
    });
}





