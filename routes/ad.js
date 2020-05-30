const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const formidable = require('formidable');

// Pusher 

var Pusher = require('pusher');

var pusher = new Pusher({
  appId: '601330',
  key: 'bde48f4ae0e395af0877',
  secret: 'b3199a63ef217d4fe27f',
  cluster: 'ap2',
  encrypted: true
});




// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './public/uploads');
//     },
//     filename: function (req, file, cb) {
//         cb(null, new Date().toDateString() + '-' + file.originalname);
//     }
// });
// const fileFilter = (req, file, cb) => {
//     //Reject File 
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
//         cb(null, true);
//     } else {
//         cb(new Error('Only image stored'), false);
//     }
// }

// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 1024 * 1024 * 3
//     },
//     fileFilter: fileFilter
// });

let Ads = require('../models/ads');
let ViewLater = require('../models/viewLater');
let MessageModel = require('../models/messages');
//Submit Ads..  SubmitAdd component
router.post('/ads', function (req, res) {
    var fileManger = new formidable.IncomingForm();
    var imageList = [];
    fileManger.parse(req, function (err, fileds, files) {
        for (var oneFile in files) {
            var commingFiles = Array.isArray(files) ? files[oneFile] : [files[oneFile]];
            commingFiles.forEach(function (file) {
                var fileRename = (new Date).getTime() + file.name;
                fs.copy(file.path, './public/uploads/' + fileRename)
                imageList.push(fileRename)
            })
        }
        let ad = new Ads();
        ad._userId = fileds._userId;
        ad.title = fileds.title;
        ad.category = fileds.category;
        ad.price = fileds.price;
        ad.condition = fileds.condition;
        ad.description = fileds.description;
        ad.photo = imageList;
        ad.name = fileds.name;
        ad.phone = fileds.phone;
        ad.province = fileds.province;
        ad.city = fileds.city;
        ad.views = 0;
        ad.date = (new Date()).toDateString();
        ad.save(function (err) {
            if (err) {
                res.status(422);
                res.json(err);

            } else {
                res.json({
                    status: "OK"
                })
            }
        })
    })
});

// Get category list items . show in List Component
router.get('/', function (req, res) {
    Ads.find({ category: req.query.category }, function (err, result) {
        if (err) {
            res.status(422);
            res.json({
                err
            })
        } else {
            // console.log(result);
            res.json(result)
        }
    });


});

// Get Search Result . specific city against all ads 
router.get('/cities', function (req, res) {
    Ads.find({ city: req.query.city }, function (err, result) {
        if (err) {
            res.status(422);
            res.json({
                err
            })
        } else {

            res.json(result)
        }
    });


});

//Get Signle Object data 
router.get('/item', function (req, res) {
    //  let query = { _id: req.query.id };
    Ads.find({ _id: req.query.id }, function (err, result) {
        if (err) {
            res.status(422);
            res.json({
                err
            })
        } else {
            // var v = parseInt(result[0].views);
            //Ads.updateOne(query, { $inc: { "views": v } });
            res.json(result)
        }
    });


});

// Delete Ads and also delete from View Later table agains _postId if anyone add his wishlist then also remove from here
router.delete('/delete/:id', function (req, res) {
    // Delete entry from wishlist
    ViewLater.deleteOne({ _postId: req.params.id }).then(suc => {

    }).catch(err => {
        res.status(500).json({
            err
        });
    })

    // Delete User own ad
    Ads.deleteOne({ _id: req.params.id })
        .exec()
        .then(result => {
            res.status(200).json({
                msg: "Ad Deleted"
            });
        })
        .catch(err => {
            res.status(500).json({
                err
            })
        });

});

// Update Ads 

//Submit Ads
router.put('/ads/update/', function (req, res) {
    //console.log(req.query.id);
    var fileManger = new formidable.IncomingForm();
    var imageList = [];
    fileManger.parse(req, function (err, fileds, files) {
        for (var oneFile in files) {
            var commingFiles = Array.isArray(files) ? files[oneFile] : [files[oneFile]];
            commingFiles.forEach(function (file) {


                var fileRename = (new Date).getTime() + file.name;
                fs.copy(file.path, './public/uploads/' + fileRename)


                imageList.push(fileRename)

            })


        }


        let ad = {};
        ad._userId = fileds._userId;
        ad.title = fileds.title;
        ad.category = fileds.category;
        ad.price = fileds.price;
        ad.condition = fileds.condition;
        ad.description = fileds.description;
        ad.photo = imageList;
        ad.name = fileds.name;
        ad.phone = fileds.phone;
        ad.province = fileds.province;
        ad.city = fileds.city;
        ad.date = (new Date()).toDateString();
        let query = { _id: req.query.id };
        Ads.updateOne(query, ad, function (err) {
            if (err) {
                res.status(422);
                res.json(err);

            } else {
                res.json({
                    status: "OK"
                })
            }
        })

    })


});


// Get The Total numbers of ads
router.get('/total/ads', function (req, res) {
    Ads.countDocuments({}, function (error, numOfDocs) {
        if (error) {
            res.json(err)
        }
        res.status(200).json(numOfDocs);



    });
});



// Store the message to table
router.post('/message', function (req, res) {
    const mname = req.body.msg.name;
    const mphone = req.body.msg.phone;
    const mmessage = req.body.msg.message;
    const muserid = req.body.msg.userID;
    const mpostid = req.body.msg.postID;
    const postedUserId= req.body.msg.postedUserId;
    let mssg = new MessageModel({
        name: mname,
        phone: mphone,
        message: mmessage,
        userID: muserid,
        postID: mpostid
    });

    mssg.save(function (err, record) {
        if (err) {
            //res.status(err);
            res.json(err);

        } else {
            pusher.trigger('message', postedUserId, {
                "message": "You have new message"
              });

            res.json({
                status: "OK"
            })
        }
    })



});

// Show messages
router.get('/showMessage', function (req, res) {
    MessageModel.find({ postID: req.query.postID }, function (err, record) {
        if (err) {
            res.send(err)
        }
        else {
            res.send(record)
        }
    })
})
// Delete message
router.delete('/deleteMessage/:id', function (req, res) {
    MessageModel.deleteOne({ _id: req.params.id }, function (err, record) {
        if (err) {
            res.send(err)
        }
        else {
            res.send(record)
        }
    })
})
module.exports = router;