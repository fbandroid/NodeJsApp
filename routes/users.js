var express = require('express');
var router = express.Router();
var urlModule = require('querystring')
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
  var jwt = require('jsonwebtoken');


// Connection URL
var url = 'mongodb://neerav:yamunaji006@ds119802.mlab.com:19802/myblog';
var dbClient;
var expressValidator = require("express-validator")

// Use connect method to connect to the server
MongoClient.connect(url,{ useNewUrlParser: true } ,function (err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  dbClient = db;


});



router.get('/register', function (req, res, next) {
  res.render('register');

})



router.post('/login', function (req, res, next) {

  var email = req.body.email;
  var mobile = req.body.mobile;
  

  if (dbClient != null) {

    dbClient.db('myblog').collection('registered_user').findOne({ email: email, mobile: mobile },
      function (err, user) {

        console.log("error" + err);
        
        assert.equal(null, err);
        if (user == undefined) {
          const query = urlModule.stringify({
            "error": "Invalid credential"
           
        });
        
        req.session.error = query
      

       // res.send(
          //   {error:"Invalid credential"}
          // )
          
          res.redirect('/?' + query);
          
          

        }
        else {

          var signOptions = {
            subject:  'test',
            audience:  'http://hanuman.tech',
            expiresIn:  60,
            algorithm:  'HS256'   // RSASSA [ "RS256", "RS384", "RS512" ]
           };

          if (req.body.email == user.email && req.body.mobile == user.mobile) {
            req.session.user = user
            req.session.error = undefined

            jwt.sign(user,'secret', signOptions ,function(err,token){
              console.log('token = '+ token);

            });

            console.log("login successfully" + JSON.stringify(req.session.user));

            if(req.session.user !== undefined && JSON.parse(JSON.stringify(req.session.user))._id !==undefined  ){
              res.redirect('/home/?'+ urlModule.stringify({ "name" : user.email }));
              //res.render('home',{ name:user.email })
            }
            else{
              res.sendStatus(401);
            }

            
          }

        }



      });


  }
  else {
    // Use connect method to connect to the server
    MongoClient.connect(url,{ useNewUrlParser: true } ,function (err, db) {
      assert.equal(null, err);
      console.log("Connected successfully to server");

      dbClient = db;


    });
  }


});

router.post('/adduser', function (req, res, next) {
  var userName = req.body.name;
  var email = req.body.email;
  var mobile = req.body.mobile;


  dbClient.db('myblog').collection('registered_user').findOne({ $or: [{ email: email }, { mobile: mobile }] }, function (err, user) {

    if ( ( user !=undefined &&  user.email == req.body.email) || (user != undefined && user.mobile == req.body.mobile)) {
      // Insert a single document
      const query = urlModule.stringify({
        "error": "user already"
       
    });

     
      res.render('register',{ "error": "user already exist" });
    }
    else {
       
      dbClient.db('myblog').collection('registered_user').insertOne({ "userName": userName, "email": email, "mobile": mobile }, function (err, r) {
        assert.equal(null, err);
        assert.equal(1, r.insertedCount);

        dbClient.close();

        res.redirect('/');



      });

    }


  });





});


// -------------------------------------------API----------------------------------------------------------------

router.get('/apitest',function(req,res){

  res.send("Hello")

});


router.post('/loginapi', function (req, res, next) {

  var email = req.body.email;
  var mobile = req.body.mobile;
  var authToken;

  if (dbClient != null) {

    dbClient.db('myblog').collection('registered_user').findOne({ email: email, mobile: mobile },
      function (err, user) {

        console.log("error" + err);
        
        assert.equal(null, err);
        if (user == undefined) {
          const query = urlModule.stringify({
            "error": "Invalid credential"
           
        });
        
        req.session.error = query
      

       // res.send(
          //   {error:"Invalid credential"}
          // )
          
        //  res.redirect('/?' + query);
          
        res.json({ msg:"Invalid credential",statusCode:401,token:null });
          

        }
        else {

          var signOptions = {
            subject:  'test',
            audience:  'http://hanuman.tech',
            expiresIn:  60,
            algorithm:  'HS256'   // RSASSA [ "RS256", "RS384", "RS512" ]
           };

          if (req.body.email == user.email && req.body.mobile == user.mobile) {
            req.session.user = user
            req.session.error = undefined

            jwt.sign(user,'secret', signOptions ,function(err,token){
              console.log('token = '+ token);
              if(!err){
                 authToken = token
                 console.log("auth token=  "+ authToken);
                 console.log("login successfully" + JSON.stringify(req.session.user));

                 if(req.session.user !== undefined && JSON.parse(JSON.stringify(req.session.user))._id !==undefined  ){
                  // res.redirect('/home/?'+ urlModule.stringify({ "name" : user.email }));
                   //res.render('home',{ name:user.email })
     
                   console.log("auth token=  "+ authToken);
     
                   res.json({ msg:"Verified",statusCode:200,token:authToken });
     
                 }
                 else{
                   res.json({ msg:"Invalid credential",statusCode:401,token:null });
                 }
              }

            });

            

            
          }

        }



      });


  }
  else {
    // Use connect method to connect to the server
    MongoClient.connect(url,{ useNewUrlParser: true } ,function (err, db) {
      assert.equal(null, err);
      console.log("Connected successfully to server");

      dbClient = db;


    });
  }


});







module.exports = router;

