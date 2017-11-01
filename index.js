/**
 * Lets not crash the program. just throw the stack
 */
process.on('uncaughtException', function (err) {
    if (err.name === "AssertionError") {
        return;
    }

    if (err.name !== "AssertionError") {
        console.log("-=- Node Critical Error Start -=-");
        console.dir(err.stack);
        console.log("-=- Node Critical Error End -=-");
    }
});

var express = require('express');
var request = require('request');
var app = express();

require('dotenv').config();

app.get('/', function(req, res){
   res.status(200).send('<iframe src="https://open.spotify.com/embed/track/3bnVNMCk5FJulcpS7aXJbY" width="300" height="380" onpause="true" frameborder="0" allowtransparency="true"></iframe>');
});

app.get('/login', function (req, res) {
    res.writeHead(302, {
        'Location': 'https://accounts.spotify.com/authorize/?client_id=' + process.env.SPOTIFY_ID + '&response_type=code&redirect_uri=' + process.env.SPOTIFY_CALLBACK + '&scope=user-read-private%20user-read-email%20streaming&state=34fFs29kd09'
    });
    res.end();
});

app.get('/callback', function (req, res) {
    console.dir(req.body);

    request.post({
        url: 'https://accounts.spotify.com/api/token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            "grant_type": "authorization_code",
            "code": req.query.code,
            "redirect_uri": process.env.SPOTIFY_CALLBACK_CLEAN,
            "client_id": process.env.SPOTIFY_ID,
            "client_secret": process.env.SPOTIFY_SECRET
        }
    }, function (error, response, body) {
        res.status(200).json(body);
    });
});


app.listen(3001, function () {
    console.log("OUR APP HAS BOOTED ON 8081")
});