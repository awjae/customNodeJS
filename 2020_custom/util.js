var util ={};

util.sendResponse= function(res, rows) {
    var result= {
        resCode:200,
        resMessage:'OK',
        results:rows
    };
    
    var output= JSON.stringify(result);
    
    res.writeHead(200, {"Content-Type":"application/json;charset=utf8"});
    res.write(output);
    res.end();  
};
module.exports= util;