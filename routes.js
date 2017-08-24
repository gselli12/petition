const {deleteSignature, updateUser, getUserData, getNamesByCity, addInfo, getSignature, getHash, addUser, addSignature, countRows, getNames} = require("./dbqueries.js");

const {hashPassword, checkPassword} = require("./hashing.js");

var express = require("express");
var router = express.Router();
const csurf = require("csurf");
const csrfProtection = csurf();

var redis = require('redis');
var client = redis.createClient({
    host: 'localhost',
    port: 6379
});

client.on('error', function(err) {
    console.log(err);
});

router.route("/")

    .get((req, res) => {
        res.redirect("/register");
    });


router.route("/register")

    .all(csrfProtection)

    .get((req, res) => {
        res.render("register", {
            csrfToken: req.csrfToken()
        });

    })

    .post((req, res) => {
        let pw = req.body.pwReg;
        let first = req.body.firstReg;
        let last = req.body.lastReg;
        let email = req.body.emailReg;

        hashPassword(pw)
            .then((hash) => {
                let data = [first, last, email, hash];
                addUser(data)
                    .then((results) => {
                        req.session.id = results.rows[0].id;
                        req.session.email = results.rows[0].emailReg;
                        res.redirect("/profile");
                    })
                    .catch( (err) => {
                        console.log(err);
                        res.render("register", {
                            error: "Something went wrong, try again",
                            csrfToken: req.csrfToken()
                        });
                    });
            });
    })
;


router.route("/login")

    .all(csrfProtection)

    .get((req, res) => {
        res.render("login", {
            csrfToken: req.csrfToken()
        });
    })

    .post((req, res) => {
        let email = req.body.emailLog;
        let pw = req.body.pwLog;

        getHash(email)
            .then((hash) => {
                checkPassword(pw, hash.pw)
                    .then((result) => {
                        if(result) {
                            res.redirect("/petition");
                        } else {
                            console.log("wrong password");
                            res.redirect("/login");
                        }
                    });
                //having a bug here -> need to somehow put the below line at the end of the above promise chain
                req.session.id = hash.id;
            })
            .catch((err) => {
                console.log(err);
                res.render("login", {
                    error: "Something went wrong, try again",
                    csrfToken: req.csrfToken()
                });
            });
    })
;


router.route("/profile")

    .all(csrfProtection)

    .get((req, res) => {
        res.render("profile", {
            csrfToken: req.csrfToken()
        });
    })

    .post((req, res) => {
        let age = req.body.ageProfile;
        let city = req.body.cityProfile;
        let url = req.body.urlProfile;
        let id = req.session.id;

        let data = [age, city, url, id];
        if (data[0] == "") {
            data[0] = null;
        }
        addInfo(data)
            .then(() => {
                res.redirect("/petition");
            })
            .catch((err) => {
                console.log(err);
            });

    })
;


router.route("/profile/edit")

    .all(csrfProtection)

    .get((req,res) => {
        let id = req.session.id;
        getUserData(id)
            .then((results) => {
                res.render("edit", {
                    info: results.rows[0],
                    csrfToken: req.csrfToken()
                });
            });
    })

    .post((req,res) => {

        let pw = req.body.pwEdit;

        hashPassword(pw)

            .then((hash) => {
                let data = [req.body.firstEdit, req.body.lastEdit, req.body.mailEdit, hash, req.body.ageEdit, req.body.cityEdit, req.body.urlEdit];

                let id = req.session.id;

                updateUser(data, id)

                    .then(() => {
                        res.redirect("/petition");
                    });
            })

            .then(() => {
                client.set("cache", JSON.stringify(null), (err) => {
                    if(err) {
                        return console.log(err);
                    }
                    console.log("cache set to null");
                });
            })
            .catch((err) => {
                console.log(err);
            });

    })
;


router.route("/petition")

    .all(csrfProtection)

    .get((req, res) => {
        res.render("petition", {
            csrfToken: req.csrfToken()
        });
    })

    .post((req, res) => {
        let data = [req.body.signature, req.session.id];

        addSignature(data)
            .then((results) => {
                req.session.sigId = results.rows[0].id;
                res.redirect("/petition/signed");
            })
            .then(() => {
                client.set("cache", JSON.stringify(null), (err) => {
                    if(err) {
                        return console.log(err);
                    }
                    console.log("cache set to null");
                });
            })
            .catch((err) =>  {
                console.log(err);
            });
    })
;


router.route("/delete")

    .get((req, res) => {
        let id = req.session.id;

        deleteSignature(id)
            .then(() => {
                res.redirect("/petition");
            })
            .catch((err) => {
                console.log(err);
            });
    })
;


router.route("/petition/signed")

    .get((req, res) => {
        let num = {};
        let img;
        countRows()
            .then((results) => {
                num.count = results.rows[0].count;
            })
            .then (() => {
                getSignature(req.session.id)

                    .then((results) => {
                        img = results.rows[0];
                    })
                    .then(() => {
                        res.render("signed", {
                            signatures : num,
                            image : img,
                        });
                    });
            })
            .catch(function(err) {
                console.log(err);
            });
    })
;


router.route("/petition/signers")

    .get((req, res) => {

        let getCache = () => {
            return new Promise((resolve, reject) => {
                client.get("cache", (err, data) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve(JSON.parse(data));
                    }
                });
            });
        };

        getCache()
            .then((data) => {
                if (data == null) {
                    getNames()
                        .then((results) => {
                            return new Promise((resolve, reject) => {
                                client.set("cache", JSON.stringify(results.rows), (err) => {
                                    if (err) {
                                        reject(console.log(err));
                                    } else {
                                        resolve(console.log("cache was successfully sent"));
                                    }
                                });
                            })
                                .then(() => {
                                    getCache()
                                        .then((data) => {
                                            res.render("signers", {
                                                names: data
                                            });
                                        });
                                });

                        });

                } else {
                    console.log("getting data from cache");
                    res.render("signers", {
                        names: data
                    });
                }
            });


            // .then(() => {
            //     return new Promise((resolve, reject) => {
            //         client.get("cache", (err, data) => {
            //             if(err) {
            //                 reject(err);
            //             } else {
            //                 // console.log(JSON.parse(data));
            //                 resolve(JSON.parse(data));
            //             }
            //         });
            //     });
            // })


    });




router.route("/petition/:city")

    .get((req, res) => {
        let city = req.params.city;
        getNamesByCity(city)
            .then((results) => {
                res.render("city", {
                    city: req.params.city,
                    info: results.rows,
                });
            });
    });



module.exports = router;
