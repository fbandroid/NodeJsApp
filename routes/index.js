var express = require('express');
var router = express.Router();
var session = require('express-session');
var jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/', function(req, res, next) {

       if(req.session.user == undefined && req.session.error !== undefined){
         res.render('index',{title:"Express",error:"Invalid Credential"});
       }
       else{
         res.render('index',{ title:"Express" });
         
       }
       

      
     }
 
);

router.get('/api',verifyToken,function(req,res,next){
      

  var signOptions = {
    subject:  'test',
    audience:  'http://hanuman.tech',
    expiresIn:  300,
    algorithm:  'HS256'   // RSASSA [ "RS256", "RS384", "RS512" ]
   };

      jwt.verify(req.token,'secret',signOptions ,function(err,authData){
         
        if(err){
          console.log(err);
          res.json( { msg:'UnAuthorized' } );
        }
        else{
          res.json({

            msg:"Api accessed successfully",
            authData
        
          });

        }

      });
  

  



});

function verifyToken(req,res,next){

  var bearer = req.headers['authorization'];

  if( typeof bearer !== 'undefined'){
     var token = bearer.split(' ')
     console.log("bearer "+token[2]);
     req.token = token[2]
     next();
  }
  else{
    res.json( {msg:'Token expired'} );
  }


}

module.exports = router;
