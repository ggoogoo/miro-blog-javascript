const express = require('express');
const router = express.Router();
const app = express()
const multer = require('multer');
const upload = multer({dest : 'uploads/'})

const Member = require('../models/Member');
const Board = require('../models/Board');
const Code = require('../models/Code');
const Quetion = require('../models/Question');
const Resource = require('../models/Resource');
const Comment = require('../models/Comment');

router.get('/', function(req, res){
  console.log(req.session)
  res.render('Intro.ejs', {user: req.session.member});
});

router.get('/Boards', function(req, res){
  Board.find({}, function(err, boards){
    Comment.find({}, function(err, comments){
      if(!err){
        res.render('Boards.ejs', {results:boards, comms:comments, user:req.session.member});
      }
    });
  });
});



router.get('/Questions', function(req, res){
  Board.find({}, function(err, boards){
    Comment.find({}, function(err, comments){
      if(!err){
        res.render('Questions.ejs', {results:boards, comms:comments, user:req.session.member});
      }
    });
  });
});

router.get('/Resources', function(req, res){
  Board.find({}, function(err, boards){
    Comment.find({}, function(err, comments){
      if(!err){
        res.render('Resources.ejs', {results:boards, comms:comments, user:req.session.member});
      }
    });
  });
});

router.get('/Codes', function(req, res){
  Board.find({}, function(err, boards){
    Comment.find({}, function(err, comments){
      if(!err){
        res.render('Codes.ejs', {results:boards, comms:comments, user:req.session.member});
      }
    });
  });
});


router.get('/BoardsWrite', function(req, res){
  res.render('BoardsWrite.ejs', {user:req.session.member});
});


router.post('/BoardsWrite', upload.array('avatar', 2), function(req,res){
  console.log(req.files);
  var fileArray = []
  var fileArray2 = []
  for(var i=0;i<req.files.length;i++){
    fileArray[i] = req.files[i].filename;
    fileArray2[i] = req.files[i].originalname;
  }
  const board = new Board({
    title: req.body.inputTitle,
    content: req.body.inputContent,
    create_at : new Date().toISOString(),
    viewnumber: 0,
    author: req.session.member.name,
    check:req.session.member.id,
    category: req.body.inputCategory,
    create_at_year : new Date().toLocaleDateString(),
    create_at_hour : new Date().toLocaleTimeString(),
    file: fileArray,
    file2: fileArray2,
  });
  board.save(function(err){
    res.redirect('/Boards')
  });
});


router.get('/BoardsRewrite/:id', function(req,res){
  if(!req.session.member){
    console.log("session.member없음")
    res.send('접근 권한이 없습니다.');
  }else{
    Board.findOne({_id: req.params.id}, function(err, board){
      console.log(req.session.member.id)
      console.log(board.check)
      if(board.check === req.session.member.id){
        res.render('BoardsRewrite.ejs', {result: board, user:req.session.member});
      }else{
          res.send('접근 권한이 없습니다.');
      }
    });
  }
})

router.post('/BoardsRewrite/:id', function(req,res){
  console.log("글 수정하기 post완료")
  Board.findOne({_id: req.params.id}, function(err, board){
    board.content = req.body.inputContent;
    board.create_at = (new Date()).toISOString();
    board.save(function(err){
      res.redirect('/BoardsShow/' + board._id);
    });
  })
})


router.post('/reviseComment/:id', function(req,res){
  Comment.findOne({_id: req.params.id}, function(err, comm){
    comm.input = req.body.inputReComm;
    comm.create_at = (new Date()).toISOString();
    comm.save(function(err){
      res.redirect('back');
    })
  })
})



router.get('/BoardsShow/:id', function(req, res){
  Board.findOne({_id:req.params.id}, function(err, board){
    Board.find({}, function(err, boards){
      Comment.find({where:board._id}, function(err, comments){
        Comment.find({}, function(err, commentss){
          var count = 0;
          var id2 = ''+ board._id;
          console.log('board._id : ' + id2);
          for(var i=0;i<boards.length;i++){
            var id = ''+ boards[i]._id;
            console.log('boards'+i+'._id : ' +id);
            if(id !== id2){
              count ++;

            }else{
              break;
            }
          }
          console.log(count);

          if(!req.session.member){
            res.send("로그인 후 이용가능합니다.")
          }else{
            board.viewnumber += 1;
            board.save(function(err){
              res.render('BoardsShow.ejs', {result:board, comms:comments, user:req.session.member, results:boards, count:count, commss:commentss });
            });
          }
        })
      });
    });
  });
});


router.post('/BoardsShow/:id/Comment', function(req, res){
    const comment = new Comment({
      input: req.body.commentInput,
      create_at: (new Date()).toISOString(),
      author: req.session.member.name,
      check: req.session.member.id,
      where : req.params.id,
    });
    comment.save(function(err){
      res.redirect('back')
  });
});


router.post('/BoardsShow/Download/:file/:file2', function(req, res){
  var path = "./uploads/"
  var name = req.params.file;
  var downName = req.params.file2;
  res.download(path+name, downName);
  console.log(name);
})


router.post('/destroyBoard/:id', function(req, res){
  console.log("board삭제 post 접근")
  Board.remove({_id: req.params.id}, function(err){
    Comment.remove({where: req.params.id}, function(err){
      res.redirect('/Boards')
    });
  });
});

router.post('/destroyComment/:id', function(req, res){
  console.log("댓글 삭제");
  console.log(req.params.id);
  Comment.remove({_id: req.params.id}, function(err){
    res.redirect('back')
  });
});



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
          res.redirect('/Boards');
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
    res.redirect('/Boards')
  });
});





module.exports = router;
