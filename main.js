var server = require('./server');
//var database = require('./database');
var util = require('./util');
var apiCall = require('./API_Call');

//기본 메인 페이지
server.get('/', function(req, res) {
    console.log('/ 요청.');
    
    req.app.render('index', '', function(err, html) {
        if (err) {
            console.log('view 처리 시 에러 발생 ->' + err);
            return;
        }
        
        res.end(html);
    });
});


server.get('/list.do', function(req, res) {
    console.log('/cunstomer list 요청됨.');
    console.log('PARAMS')
    console.log(req.query);
    

    var sql = "select id, pw from test.users";
    var dbParams = [];
    database.query(res, sql, dbParams, function(err, rows){
        var output= {
            rows:rows
        };
        console.log(output);
        
        req.app.render('list', output, function(err, html) {
        if (err) {
            console.log('view 처리 시 에러 발생 ->' + err);
            return;
        }
        
        res.end(html);
        });
        
    });
    
});

//post 요청
server.post('/postList.do', function (req, res) {
    console.log('/postList.do 요청됨');
    console.log('PARAMS');
    console.dir(req.body);

    var paramId = req.body.id;
    var paramPw = req.body.pw;

    var sql = "select id, pw from test.users where id = ? and pw = ?";

    var dbParams = [paramId, paramPw];
    
    database.query(res, sql, dbParams, function(err, rows) {
        
        req.session.user= {
            id: rows[0].id,
            name: rows[0].name
        };
        
        if (rows.length > 0) {
            util.sendResponse(res, rows);
        } else {
            util.sendResponse(res, []);
        } 
        
    });

});

//API 요청 예시
server.get('/dnfServerList.do', function (req, res) {
    console.log('/dnfServerList.do 요청됨');
    console.log(req.query.characterName)
    console.log(req.query.jobId)
    var apiData = apiCall.API_Call('get', 'dnfServerList');
    apiData.send([], function (err, result) {
        if (!err) {
            res.send(result);
        } else {
            res.send(err);
        }
    });
});

server.get('/postgresReqExample.do', function(req, res) {
    var data = req.query;
    var sql = `SELECT * FROM test1 WHERE id = $1 AND password = $2`
    var dbParams = [data.lng, data.lat]
    database.PgQuery(res, sql, dbParams, function(err, rows) {

        if (rows.length > 0) {
            util.sendResponse(res, rows);
        } else {
            util.sendResponse(res, []);
        } 
       
    });
});


server.start();