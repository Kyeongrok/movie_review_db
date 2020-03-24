var express = require('express');
var router = express.Router();
var mysql_odbc = require('../db/db_conn')();
var conn = mysql_odbc.init();

router.get('/list:page', function(req, res, next) {
    res.redirect('/board/list/1');
});

router.get('/list/:page', function(req, res, next) {
    var page = req.params.page;
    var sql = "select idx, name, title, date_format(modidate,'%Y-%m-%d %H:%i:%s') modidate, " +
        "date_format(date,'%Y-%m-%d %H:%i:%s') date,hit from board";
    conn.query(sql, function (err, rows) {
        if (err) console.error("err : " + err);
        res.render('list', {title: ' movie_list', rows: rows});
    });
});
module.exports = router;

router.get('/write', function(req,res,next){
    res.render('write',{title : "Write"});
});

router.post('/write', function(req,res,next){
    var name = req.body.name;
    var title = req.body.title;
    var content = req.body.content;
    var passwd = req.body.passwd;
    var datas = [name,title,content,passwd];

    var sql = "insert into board(name, title, content, regdate, modidate, passwd,hit) values(?,?,?,now(),now(),?,0)";
    conn.query(sql,datas, function (err, rows) {
        if (err) console.error("err : " + err);
        res.redirect('/board/list');
    });
});

router.get('/read/:idx',function(req,res,next)
{
    var idx = req.params.idx;
    var sql = "select idx, name, title, content, date_format(modidate,'%Y-%m-%d %H:%i:%s') modidate, " +
        "date_format(regdate,'%Y-%m-%d %H:%i:%s') regdate,hit from board where idx=?";
    conn.query(sql,[idx], function(err,rows)
    {
        if(err) console.error(err);
        res.render('read', {title:"Detail", row:rows[0]});
    });
});

router.post('/update',function(req,res,next)
{
    var idx = req.body.idx;
    var name = req.body.name;
    var title = req.body.title;
    var content = req.body.content;
    var passwd = req.body.passwd;
    var datas = [name,title,content,idx,passwd];

    var sql = "update board set name=? , title=?,content=?, modidate=now() where idx=? and passwd=?";
    conn.query(sql,datas, function(err,result)
    {
        if(err) console.error(err);
        if(result.affectedRows == 0)
        {
            res.send("<script>alert('Incorrect Password');history.back();</script>");
        }
        else
        {
            res.redirect('/board/read/'+idx);
        }
    });
});

router.get('/page/:page',function(req,res,next)
{
    var page = req.params.page;
    var sql = "select idx, name, title, date_format(modidate,'%Y-%m-%d %H:%i:%s') modidate, " +
        "date_format(regdate,'%Y-%m-%d %H:%i:%s') regdate,hit from board";
    conn.query(sql, function (err, rows) {
        if (err) console.error("err : " + err);
        res.render('page', {title: ' Movie reviews', rows: rows, page:page, length:rows.length-1, page_num:10});
        console.log(rows.length-1);
    });
});

router.post('/delete',function(req,res,next)
{
    var idx = req.body.idx;
    var passwd = req.body.passwd;
    var datas = [idx,passwd];

    var sql = "delete from board where idx=? and passwd=?";
    conn.query(sql,datas, function(err,result)
    {
        if(err) console.error(err);
        if(result.affectedRows == 0)
        {
            res.send("<script>alert('Incorrect Password');history.back();</script>");
        }
        else
        {
            res.redirect('/board/list/');
        }
    });
});
