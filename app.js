require('dotenv').config();
var axios = require("axios").default;
const express = require('express');
const { urlencoded } = require('body-parser');
const app = express();

const port = process.env.PORT || 4567;


app.get('/translate/:toLang/:toTranslate', async (req, res) => {
    let lang = req.params.toLang || 'en';

    var options = {
        method: 'POST',
        url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
        params: {to: lang, 'api-version': '3.0', profanityAction: 'NoAction', textType: 'plain'},
        headers: {
          'content-type': 'application/json',
          'x-rapidapi-host': 'microsoft-translator-text.p.rapidapi.com',
          'x-rapidapi-key': process.env.API_KEY
        },
        data: [{Text: req.params.toTranslate }]
      };
    axios.request(options).then(function (response) {
        res.send(response.data[0].translations[0].text);
    }).catch(function (error) {
        console.error(error);
    });
});


const server = app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});