const dotenv = require('dotenv');
const TelegramApi = require('node-telegram-bot-api');
const request = require('request');
const iconv  = require('iconv-lite');
const fs = require("fs");

const opt = {
    url: 'http://www.pofoms.ru/RegRefInfo/tpoms/Pages/Tarif.aspx',
    encoding: null,
    rejectUnauthorized: false
}


dotenv.config();
const token = process.env.TOKEN;
const chatId = process.env.CHATID;
const bot = new TelegramApi(token, {polling: true});
let resultText;//

request(opt, function (err, res, body) {
    if (err) throw err;

    let textFromReq = iconv.decode(body, 'utf-8');
    let lines = textFromReq.toString()//split(/\'subpnl_,\d*/);
    let tmpLines = lines.replace(/subpnl_[^\n]+_1\'/g, '');
    let tmpLines2 = tmpLines.replace(/__REQUESTDIGEST[^\n]+\/>/g, '')

   fs.writeFile('data/dataPermTMP.txt', tmpLines2, (err) => {
        if (err) {
          console.error(err)
          return
        }
        //файл записан успешно
      })
    
    textIsEqual();  
    console.log(res.statusCode);
});

function textIsEqual() {
    fs.readFile('data/etalonPerm.txt', (err, data1) => {
        if (err) throw err;
        fs.readFile('data/dataPerm.txt', (err, data2) => {
         if (err) throw err;
         if (data1.equals(data2)) {
            bot.sendMessage(chatId, 'ПЕРМЬ без изменений');
         } else {
            fs.writeFile('data/etalonPerm.txt', data2, (err) => {
                if (err) throw err;
                console.log('The file has been changed!');
              })
              bot.sendMessage(chatId, 'Были изменения в ПЕРМЬ');
         }

        });
    });
}





