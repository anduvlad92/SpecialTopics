var express = require('express')
var app = express()
var http = require('http').createServer(app,handler); //require http server, and create server with function handler()
var fs = require('fs'); //require filesystem module
var bodyParser = require('body-parser');
var io = require('socket.io')(http)


io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('light',function(message){
    console.log("Light received"+JSON.parse(message)["state"])
    changeLightState(JSON.parse(message)["state"])
  })
});



var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/special_topics";
var database;
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  database = db.db("special_topics");
  console.log("Database created!");
});




app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
http.listen(8080); //listen to port 8080

function handler (req, res) { //create server
  fs.readFile(__dirname + '/index.html', function(err, data) { //read file index.html in public folder
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
      return res.end("404 Not Found");
    } 
    res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML
    res.write(data); //write data from index.html
    return res.end();
  });
}


app.get('/',function(req,res){
  res.send({'response':'Ok','message':'Hello World'})
})


app.post('/sensorState',function(req,res){
  res.send('OK')
})



function changeLightState(state){
  io.emit('light',{'state':state})
}

app.post('/sensor',function(req,res){
  console.log(req.body)
  io.emit("sensorData",req.body)
  database.collection('sensor_data').insertOne(req.body,function(err,res){
    if(err) throw err;
    console.log('1 document inserted');
  })
  res.send('OK')
})

app.listen(3000)