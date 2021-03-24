var server = {};

var express = require('express');
var http = require('http');
var path = require('path');
var static = require('serve-static');
var cors = require('cors');
var bodyParser = require('body-parser');

var session= require('express-session');

var app = express();

app.set('views',path.join(__dirname,'src'));
app.set('view engine', 'ejs');
//렌딩 페이지 다루기

//세션을 위한 초기화 작업, 등록을해주는다는 느낌
app.use(session({
    secret: 'mykey',
    resave: false,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({limit:'50mb', extended:false}));
app.use(bodyParser.json({limit:'50mb'}));

// 사전에 처리하고 싶은경우 app.use사용
app.use('/', static(path.join(__dirname, 'public')));
app.use(cors());

var router = express.Router();
app.use('/', router);

//var port = 3002;
var port = process.env.PORT || 8080;

server.start = function() {
    http.createServer(app).listen(port, function() {
    console.log('웹 서버 실행됨: ' + port);
    });
};

server.post = function(reqPath, callback) {
    router.route(reqPath).post(callback);
}

server.get = function(reqPath, callback) {
    router.route(reqPath).get(callback);
}

server.router = router;

module.exports = server;