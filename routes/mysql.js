var express = require('express');
var router = express.Router();
//mysql 인스턴트 가져오기
var mysql = require('mysql');

//createConnection으로 데이터베이스 설정을 입력
router.get('/', function(req, res, next) {

    var connection = mysql.createConnection({
        host    :'localhost',
        port : 3306,
        user : 'root',
        password : '12345678',
        database:'nodedb'
    });

//connect 함수로 접속과 동시에 연결 설정에 대한 확인
    connection.connect(function(err) {
        if (err) {
            res.render('mysql', { connect: 'Fail to connect',err:err });
            console.error(err);
            throw err;
        }else{
            res.render('mysql', { connect: 'Connected!',err:'없음' });
        }
    });
    //연결 끊는다.
    connection.end();
});


module.exports = router;
