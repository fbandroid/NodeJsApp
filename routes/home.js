var express = require('express');
var router = express.Router();
var session = require('express-session');
var jwt = require('jsonwebtoken');
var io = require('socket.io');
var thisFile ;
/* GET home page. */
router.get('/', function (req, res, next) {


    if (req.session.user == undefined) {
        res.sendStatus(401)
    }
    else {
 res.render('home', { name: JSON.parse(JSON.stringify(req.session.user)).email });
    }
}



);

router.get('/logout', function (req, res) {

    req.session.destroy();
    res.redirect('/');
});

router.post('/upload', function (req, res) {
   // console.log(req.files)
    if (!req.files.pic || !req.files.pic.name)
        return res.status(400).send('No files were uploaded.');

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files;

    // sampleFile.forEach(element => {
    //       // Use the mv() method to place the file somewhere on your server
    // element.mv('e:/NodeJsDemo/myapp/public/profile/'+new Date().getTime()+'.jpg', function(err) {
    //     if (err)
    //       return res.status(500).send(err);


    //   });
    // });


    for (var key in sampleFile) {
        thisFile = sampleFile[key];
        console.log(thisFile);
      //  console.log(sampleFile[key].name);
        thisFile.mv('public/profile/' + sampleFile[key].name, function (err) {
            if (err) {
                console.log(err);
            }
            else {
                console.log('File uploaded!');
            }
        });
    }

    res.send('File uploaded!');
});

//------------------------------------------------------------------API-----------------------------------------------------
 router.post('/uploadapi', verifyToken ,function (req, res) {

    var signOptions = {
        subject: 'test',
        audience: 'http://hanuman.tech',
        expiresIn: 300,
        algorithm: 'HS256'   // RSASSA [ "RS256", "RS384", "RS512" ]
    };

    jwt.verify(req.token, 'secret', signOptions, function (err, authData) {

        if (err) {
            console.log(err);
            res.json({ msg: 'UnAuthorized', statusCode: 401 });
        }
        else {
            if (!req.files)
                return res.json({ msg: "No file uploaded" });

            // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
            let sampleFile = req.files;

            // sampleFile.forEach(element => {
            //       // Use the mv() method to place the file somewhere on your server
            // element.mv('e:/NodeJsDemo/myapp/public/profile/'+new Date().getTime()+'.jpg', function(err) {
            //     if (err)
            //       return res.status(500).send(err);


            //   });
            // });


            for (var key in sampleFile) {
                thisFile = sampleFile[key];
                console.log(sampleFile[key].name);
                thisFile.mv('public/profile/' + sampleFile[key].name, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('File uploaded!');
                    }
                });
            }

            res.json({ msg: "Successfully uploaded", statusCode: 200 });

        }

    });
});

function verifyToken(req,res,next){

    var bearer = req.headers['authorization'];
  
    if( typeof bearer !== 'undefined'){
       var token = bearer.split(' ')
       console.log("bearer "+token[1]);
       req.token = token[1]
       next();
    }
    else{
      res.json( {msg:'Token expired', statusCode:401} );
    }
}


module.exports = router;