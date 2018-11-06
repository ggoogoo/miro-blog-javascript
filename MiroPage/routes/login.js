var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Member = require('../models/Member');
//--------------------회원가입-----------------------------------
router.post('/register', function(req, res){
  Member.find({id: req.body.id}, function(err, member){
    if(err) throw err;
    if(member.length > 0){
      alert('이미존재하는 아이디입니다.')
      res.redirect('/');
    }else{
      if(req.body.password === req.body.passwordCheck && req.body.position !== 'none' && req.body.pwQuestion !== 'none'){
        var member = new Member({
                  id: req.body.id,
                  password: req.body.password,
                  name: req.body.name,
                  studentId: req.body.studentId,
                  pwAnswer: req.body.pwAnswer,
                  pwQuestion: req.body.pwQuestion,
                  position: req.body.position
        });
        member.password = member.generateHash(member.password);
        member.save(function(err){
          if(err) throw err;
          res.redirect('/');
        });
      }else{
        alert('아래 정보를 모두 바르게 기입해 주세요.')
        res.redirect('/');
      }
    }
  });
});
//----------------------로그인/로그아웃----------------------------
router.post('/login', function(req, res){
  Member.findOne({id: req.body.id}, function(err, member){
    console.log(req.session.member)
    if(!member){
      res.redirect('/');
    }else{
      if(!member.validateHash(req.body.password)){
        //비번틀림
        res.redirect('/');
      }else{
        req.session.member = member;
        res.redirect('/');
      }
    }
  });
});

router.get('/logout', function(req, res){
  req.session.destroy(function(err){
    res.redirect('/')
  });
});


module.exports = router;
