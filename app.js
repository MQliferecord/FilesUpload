var express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
var path = require('path');
var cookieParser = require('cookie-parser');

let app = express()
var http = require('http');
var server = http.createServer(app);

app.use(bodyParser.urlencoded({extended:true}));
//app.use(bodyParser.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }));
//app.use(express.json())
app.use(cookieParser());
//静态资源
app.use(express.static(path.join(__dirname, 'public')));

let uploadRouter = require('./routes/upload')
app.use('/upload', uploadRouter)

server.listen('3000',function(){
  console.log("3000端口监听中。")
})



