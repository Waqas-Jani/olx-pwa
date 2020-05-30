const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
// const passport = require('passport');
// var LocalStrategy = require('passport-local').Strategy;

// Bringing the user model 
let User = require('../models/users');

let Ads = require('../models/ads');
let ViewLater = require('../models/viewLater');
// Register process form
router.post('/register', function (req, res) {

    const email = req.body.email;
    const name = req.body.name;



    const password = req.body.password;
    const confirm = req.body.confirm;
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('confirm', 'Confirm password is required;').notEmpty();
    req.checkBody('password', 'must be at least 6 chars long').isLength({ min: 6 });
    req.checkBody('confirm', 'Password not matched').equals(password);

    let errors = req.validationErrors();
    if (errors) {
        res.status(422).json({

            errors,
            redirect: "/user/register"
        });
        return;
    } else {
        User.find({ email: email }, function (err, preUser) {
            if (err) {
                res.status(500).json({
                    errors: [{
                        param: "Server Error",
                        msg: "Internal Server Error"
                    }]
                })
            } else if (preUser.length > 0) {
                res.status(422).json({
                    errors: [{
                        param: "Email",
                        msg: "Your email already exists."
                    }]
                });
            } else {

                bcrypt.hash(password, 10, function (er, hash) {
                    if (er) {
                        res.status(500).json({
                            er
                        });
                    } else {

                        let NewUser = new User();
                        NewUser.name = name;
                        NewUser.email = email;
                        NewUser.password = hash;
                        NewUser.save(function (err) {
                            if (err) {
                                res.status(422);
                                res.json(err);
                            } else {
                                res.json({
                                    status: "OK"
                                })
                            }
                        });
                    }
                });
            }
            return;
        });
    }
});






// User Login
router.post('/login', function (req, res, next) {

    const email = req.body.email;

    const password = req.body.password;
    req.checkBody('email', 'Email is required').notEmpty();
    //req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();

    let errors = req.validationErrors();
    if (errors) {
        res.status(422).json({

            errors,
        });
        return;
    }

    User.find({ email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    msg: "User does not exist."
                })
            }
            bcrypt.compare(password, user[0].password, function (err, result) {
                if (err) {
                    return res.status(401).json({
                        msg: 'password not matched.'
                    })
                } else if (result) {
                    return res.status(200).json(
                        user[0]
                    )
                } else {
                    res.status(401).json({
                        msg: "User does not exist."
                    });
                }

            });
        })
        .catch(er => {
            res.status(500).json({
                er
            });
        })



});




router.get('/ads/:userId', function (req, res) {
    Ads.find({ _userId: req.params.userId }, function (err, result) {
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



// User Update his info

// Register process form
router.put('/update/:id', function (req, res) {
    const query = { _id: req.params.id };
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirm = req.body.confirm;
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('confirm', 'Confirm password is required;').notEmpty();
    req.checkBody('password', 'must be at least 6 chars long').isLength({ min: 6 });
    req.checkBody('confirm', 'Password not matched').equals(password);
    let errors = req.validationErrors();
    if (errors) {
        res.status(422).json({
            errors,
        });
        return;
    } else {
        User.find({ email: email }, function (err, preUser) {
            if (err) {
                res.status(500).json({
                    errors: [{
                        param: "Server Error",
                        msg: "Internal Server Error"
                    }]
                })
            } else if (preUser.length > 0) {
                res.status(422).json({
                    errors: [{
                        param: "Email",
                        msg: "Your email already exists."
                    }]
                });
            } else {
                bcrypt.hash(password, 10, function (er, hash) {
                    if (er) {
                        res.status(500).json({
                            er
                        });
                    } else {
                        let updateuser = {};
                        updateuser.name = name;
                        updateuser.email = email;
                        updateuser.password = hash;
                        User.updateOne(query, updateuser, function (err, result) {
                            if (err) {
                                res.status(422);
                                res.json(err);
                            } else {
                                res.json({
                                    result
                                })
                            }
                        });
                    }
                });
            }
            return;
        });
    }
});


// Get User and update the local object 

// router.get('/update/object/:id', function (req, res) {
//     User.find({ _id: req.params.id }, function (err, result) {
//         if (err) {
//             res.status(422);
//             res.json({
//                 err
//             })
//         } else {
//             res.json(result)
//         }
//     });

// });


// Delete User Account 
router.delete('/delete/account/:id', function (req, res) {
    //All whishlist empty related to spcific user

    ViewLater.deleteMany({ _userId: req.params.id }).then(r => {
    }).catch(err => console.log(err));
    //pely user ki sari ads fetch kro
    Ads.find({ _userId: req.params.id }, function (err, userpost) {
        if (err) {
            // res.status(500).json(err)
        } else {
            // get post ids ka array and store into array
            var postid = [];

            for (var x in userpost) {
                postid.push(userpost[x]._id);
            }
            // where in  delete viewlater 
            ViewLater.deleteMany({ _postId: { $in: postid } }).then().catch(err => res.status(500).json({
                err
            }));
            // All Specific user ads delete
            Ads.deleteMany({ _userId: req.params.id }).then(suc => {

            }).catch(err => {
                res.status(500).json({
                    err
                })
            });




        }

    })

    // Then user account remove 
    User.deleteOne({ _id: req.params.id })
        .exec()
        .then(result => {
            res.status(200).json({
                msg: "User Deleted Successfully"
            });
        })
        .catch(err => {
            res.status(500).json({
                err
            })
        });
});

// View Later 

router.post('/viewlater', function (req, res) {
    let postId = req.body._postId;
    let userId = req.body.userId;
    ViewLater.find({ _postId: postId, _userId: userId }, function (err, post) {
        if (err) {
            res.status(500).json(err)
        } else if (post.length > 0) {
            res.status(422).json({
                errors: [{
                    param: "Ad",
                    msg: "Ad already Added."
                }]
            });
        } else {
            let view = new ViewLater();
            view._postId = postId;
            view._userId = userId;
            view.save(function (err, result) {
                if (err) {
                    res.status(422);
                    res.json(err);
                } else {
                    res.json({
                        status: "OK"
                    })
                }
            });
        }
    });
});

// Get View later ads list against specific id

router.get('/ads/viewlater/:id', function (req, res) {
    let _userId = req.params.id;
    ViewLater.find({ _userId }, function (err, post) {
        if (err) {
            res.status(500).json(err);
        }


        var arr = [];

        for (var x in post) {
            arr.push(post[x]._postId);
        }
        Ads.find({ _id: { $in: arr } }, function (err, result) {
            if (err) {
                res.status(500).json(err)
            }
            res.status(200).json(result);
        });
    });

});

// Remove from WhishList 
router.delete('/whishlist/delete/:postId/:userId', function (req, res) {
    ViewLater.deleteOne({ _postId: req.params.postId, _userId: req.params.userId }).then(suc => {
        res.status(200).json({
            msg: "Remove From List"
        })

    }).catch(err => {
        res.status(500).json({
            err
        });
    })

});

module.exports = router;