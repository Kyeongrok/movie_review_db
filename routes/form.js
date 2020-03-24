var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('form', {
        name: 'Park Chae Yeon'
    });
});

router.post('/',function(req,res,next){
    res.json(req.body);}
);
module.exports = router;

