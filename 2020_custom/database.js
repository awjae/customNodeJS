var database = {};

var mysql = require('mysql');
var util = require('./util'); // util.js안의 정보를 요청함

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'test',
    debug: false
});

//pg
// const pg = new Client({
//     user : 'postgres',
//     host : '121.160.17.75',
//     database : 'navi',
//     password : 'postgres',
//     port : 5432,
// });
// pg.connect();

database.query = function(res, sql, dbParams, callback) {
    pool.getConnection(function (err, conn) {
        if (err) {
            console.log('DB 연결시 에러 발생: ' + err);

            if (conn) {
                conn.release();
            }
            return;
        }

        var query = conn.query(sql, dbParams, function(err2, rows) {
            if (conn) {
                conn.release();
                console.log(query.sql);
            }
            
            if (err2) {
                console.log('SQL 실행시 에러 발생: ' + err2);
                
                callback(err2, null);
                
                return;
            }
            
            if (callback) {
                callback(null, rows);  
            }            
            
        });
    });
    
};

//pg
// database.PgQuery = function(res, sql, dbParams, callback) {

//     pg.query(sql, dbParams, (err, res) => {
//         if (err) {
//             console.log(err.stack)
//             console.log('pgQuery 에러')
//             return;
//         } else {
//             //console.log(res.rows[0]);
//         }
//         if (callback) {
//             callback(null, res.rows);  
//         }    
//     });
// }


module.exports = database;