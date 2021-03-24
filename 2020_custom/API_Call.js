var apiCall = {};

var apiRequest = require('request');
var apiKey_dnf = 'DoPQtFzzElCIKOk84xbWGWK4yfttinQm';

apiCall.API_Call = (method, paramsStr, callee) => {
    
    var OPTIONS = {
        headers: {'Content-Type': 'application/json'},
        url: null,
        body: null
    };
    const PORT = '3500';
    const BASE_PATH = '/api/v1';
    var HOST = null;
    switch (callee) {
        case 'dev':
            HOST = 'https://dev-api.com';
            break;
        case 'another':
            HOST = 'http://localhost';
            break;
        case 'dnfServerList' :
            HOST = 'https://api.neople.co.kr/df/servers?apikey=' + apiKey_dnf;
            break;
        case 'ChitTimeLine' :
            HOST = 'https://api.neople.co.kr/df/servers/' + paramsStr + apiKey_dnf;
            break;
        default:
            HOST = 'http://localhost';
    }


    if (method === 'post') {
        return {
        
            login : function (user_id, password, callback) {
                OPTIONS.url = HOST + ':' + PORT + BASE_PATH + '/login';
                OPTIONS.body = JSON.stringify({
                    "user_id": user_id,
                    "password": password
                });
    
                apiRequest.post(OPTIONS, function (err, res, result) {
                    statusCodeErrorHandler(res.statusCode, callback, result);
                });
            }
        };
    } else if (method === 'get') {
        return {
            send : function (paramsArr, callback) {
                OPTIONS.url = HOST;
                apiRequest.get(OPTIONS, function (err, res, result) {
                    statusCodeErrorHandler(res, callback, result);
                });
            }
        }
    }
}

function statusCodeErrorHandler(res, callback , data) {
    switch (res.statusCode) {
        case 200:
            callback(null, JSON.parse(data));
            break;
        default:
            callback('error', JSON.parse(data));
            break;
    }
}

(function () {
    var INSTANCE;
    if (INSTANCE === undefined) {
        INSTANCE = new API_Call(callee);
    }
    return INSTANCE;
    }
)
module.exports = apiCall;