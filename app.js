require('dotenv').config();
var axios = require("axios").default;
const express = require('express');
const { urlencoded } = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const Channels = require('./models/Channels');

const port = process.env.PORT || 4567;

const mongoURL = process.env.MONGO_URL;
const dbName = process.env.MONGO_DB;

const server = app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});

 mongoose.connect(`${mongoURL}/${dbName}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/translate/:api_key/:toLang/:toTranslate', async (req, res) => {
    let channelName = req.headers['nightbot-channel'] || undefined;
    if (channelName) {
        channelName.split("name=")[1].split("&")[0];
        const filter = { name: channelName };
        const update = { $inc: { uses: 1 } };
        let channel = await Channels.findOneAndUpdate(filter, update, {
            new: true
          });
/*           if (!channel.name) {
            const newChannel = new Channels({
                name: channelName,
                uses: 1
            });
            newChannel.save(err => {
                if (err) {
                    console.log(`An error has occurred: ${err}`);
                }
            });
          } */
        
    }
    if (!req.params.api_key) {
        res.send("Error, no API Key provided!");
    }

    let lang = req.params.toLang || 'en';
    let splitText = req.params.toTranslate.split(" ");
    let removedLang = splitText.shift();
    splitText = splitText.join(" ");

    var options = {
        method: 'POST',
        url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
        params: {to: lang, 'api-version': '3.0', profanityAction: 'NoAction', textType: 'plain'},
        headers: {
          'content-type': 'application/json',
          'x-rapidapi-host': 'microsoft-translator-text.p.rapidapi.com',
          'x-rapidapi-key': req.params.api_key
        },
        data: [{Text: splitText }]
      };
    axios.request(options).then(function (response) {
        res.send(response.data[0].translations[0].text);
    }).catch(function (error) {
        console.error(error);
    });
});

/* app.get('/translate/:toLang/:toTranslate', async (req, res) => {
    let lang = req.params.toLang || 'en';
    let splitText = req.params.toTranslate.split(" ");
    let removedLang = splitText.shift();
    splitText = splitText.join(" ");

    var options = {
        method: 'POST',
        url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
        params: {to: lang, 'api-version': '3.0', profanityAction: 'NoAction', textType: 'plain'},
        headers: {
          'content-type': 'application/json',
          'x-rapidapi-host': 'microsoft-translator-text.p.rapidapi.com',
          'x-rapidapi-key': process.env.API_KEY
        },
        data: [{Text: splitText }]
      };
    axios.request(options).then(function (response) {
        res.send(response.data[0].translations[0].text);
    }).catch(function (error) {
        console.error(error);
    });
});
 */