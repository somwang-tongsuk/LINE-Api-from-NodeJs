'use strict';
const config = require('./config.json');
var express = require("express");
var path = require('path');
var bodyParser = require('body-parser');
var pug = require('ejs');
var app = express();

app.use(bodyParser.json());

var MongoClient = require('mongodb').MongoClient;
//Create a database named "line":
var url = "mongodb://localhost:27017/line";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});

app.set('view engine', 'ejs');
app.set('views', './vendor/Admin')
app.use(express.static(path.join(__dirname, 'vendor/Admin')))
app.get("/admin", (req, res) => {
   res.render('main', {header: 'dashboard_test'})
});

app.get('/login' ,function(req, res){
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.get("/users/:userId", (req, res) => {
 res.send(req.params);
});

/* Start Line */
const line = require('@line/bot-sdk');
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

const client = new line.Client(config);

// simple reply function
const replyText = (token, text) => {
    const msg = { type: 'text', text };
    return client.replyMessage(token, msg);
  }
  
  async function handleEvent(event) {
    switch (event.type) {
      case 'message':
        const message = event.message;
        switch (message.type) {
          case 'text':
            return handleText(message, event.replyToken);
          case 'image':
            return handleImage(message, event.replyToken);
          case 'video':
            return handleVideo(message, event.replyToken);
          case 'audio':
            return handleAudio(message, event.replyToken);
          case 'location':
            return handleLocation(message, event.replyToken);
          case 'sticker':
            return handleSticker(message, event.replyToken);
          default:
            throw new Error(`Unknown message: ${JSON.stringify(message)}`);
        }
  
      case 'follow':
        const profile = await client.getProfile(event.source.userId);
        return replyText(event.replyToken, `สวัสดีคุณ ${profile.displayName} ยินดีต้อนรับครับ`);
  
      case 'unfollow':
        return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);
  
      case 'join':
        return replyText(event.replyToken, `Joined ${event.source.type}`);
  
      case 'leave':
        return console.log(`Left: ${JSON.stringify(event)}`);
  
      case 'postback':
        let data = event.postback.data;
        return replyText(event.replyToken, `Got postback: ${data}`);
  
      case 'beacon':
        const dm = `${Buffer.from(event.beacon.dm || '', 'hex').toString('utf8')}`;
        const replyMessage = `${event.beacon.type} beacon hwid : ${event.beacon.hwid} with device message = ${dm}`;
        return replyText(event.replyToken, replyMessage);
  
      default:
        throw new Error(`Unknown event: ${JSON.stringify(event)}`);
    }
  }
  
  function handleText(message, replyToken) {
    if (message.text === 'hi') {
      const msg = {
        type: 'text',
        text: 'hello'
      };
      return replyText(replyToken, msg);
    } else {
      return replyText(replyToken, message.text);
    }
  }
  
  function handleImage(message, replyToken) {
    return replyText(replyToken, 'Got Image');
  }
  
  function handleVideo(message, replyToken) {
    return replyText(replyToken, 'Got Video');
  }
  
  function handleAudio(message, replyToken) {
    return replyText(replyToken, 'Got Audio');
  }
  
  function handleLocation(message, replyToken) {
    return replyText(replyToken, 'Got Location');
  }
  
  function handleSticker(message, replyToken) {
    return replyText(replyToken, 'Got Sticker');
  }
/* End Line */

/* Start Base Function */
var data =[];
app.get('/get', function (req, res) {
    console.log('get data');
    res.send(data);
});
  
app.post('/add', function (req, res) {
    console.log('add data');
    req.body.id = data.length +1;
    data.push(req.body);
    res.send(data);
});
  
app.put('/edit', function (req, res) {
    if(req.body.id)
      data[req.body.id-1] = req.body;
    console.log("edit data!");
    res.send(data);
});
  
app.delete('/delete', function (req, res) {
    if(req.body.id)
      data.splice(req.body.id-1,1);
    console.log("delete data!");
    res.send(data);
});
/* End Base Function */

const port = config.port;
app.listen(port, () => {
//var host = server.address().address;
//var port = server.address().port;
  console.log(`listening on ${port}`);
});