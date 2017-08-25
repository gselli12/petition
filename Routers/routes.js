const {deleteSignature, updateUser, getUserData, getNamesByCity, addInfo, getSignature, getHash, addUser, addSignature, countRows, getNames} = require("./dbqueries.js");

const {hashPassword, checkPassword} = require("./hashing.js");

const {incrementLoginCheck, getLoginCheck, clearCache ,getCache, setCache} = require("./redis.js");

var express = require("express");
var router = express.Router();
const csurf = require("csurf");
const csrfProtection = csurf();


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

        let pw = req.body.pwReg,
            first = req.body.firstReg,
            last = req.body.lastReg,
            email = req.body.emailReg;

        hashPassword(pw)
            .then((hash) => {
                let data = [first, last, email, hash];

                addUser(data)
                    .then((results) => {
                        req.session.user = {
                            id: results.rows[0].id,
                            email: results.rows[0].id
                        };
                        req.session.user.id = results.rows[0].id;
                        req.session.email = results.rows[0].email;
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
        getLoginCheck()
            .then((data) => {
                if (data < 3 || data == 0) {
                    res.render("login", {
                        csrfToken: req.csrfToken()
                    });
                } else {
                    res.render("login", {
                        csrfToken: req.csrfToken(),
                        block: true,
                        error: "That was one too many - try again in 60 seconds"
                    });
                }
            });
    })

    .post((req, res) => {
        let email = req.body.emailLog,
            pw = req.body.pwLog;

        getHash(email)
            .then((hash) => {
                checkPassword(pw, hash.pw)
                    .then((result) => {
                        if(result) {
                            res.redirect("/petition");
                        } else {
                            console.log("wrong password");

                            getLoginCheck()
                                .then((data) => {
                                    console.log(data);
                                    if(data < 3 || data == null) {
                                        incrementLoginCheck(data);
                                        res.render("login", {
                                            csrfToken: req.csrfToken(),
                                            error: "Wrong password, try again"
                                        });
                                    } else {
                                        console.log("that was one too many");
                                        res.render("login", {
                                            csrfToken: req.csrfToken(),
                                            block: true,
                                            error: "That was one too many - try again in 60 seconds"
                                        });
                                    }

                                });
                        }
                    });
                //having a bug here -> need to somehow put the below line at the end of the above promise chain
                req.session.user.id = hash.id;
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
        let age = req.body.ageProfile,
            city = req.body.cityProfile,
            url = req.body.urlProfile,
            id = req.session.user.id;

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
        let id = req.session.user.id;
        getUserData(id)
            .then((results) => {
                res.render("edit", {
                    info: results.rows[0],
                    csrfToken: req.csrfToken()
                });
            });
    })

    .post((req,res) => {

        let pw = req.body.pwEdit,
            first = req.body.firstEdit,
            last = req.body.lastEdit,
            mail = req.body.mailEdit,
            age = req.body.ageEdit,
            city = req.body.cityEdit,
            url = req.body.urlEdit,
            id = req.session.user.id;

        hashPassword(pw)

            .then((hash) => {
                let data = [first, last, mail, hash, age, city, url];

                updateUser(data, id)

                    .then(() => {
                        res.redirect("/petition");
                    });
            })

            .then(() => {
                clearCache();
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
        let signature = req.body.signature,
            id = req.body.user.id,
            data = [signature, id];

        addSignature(data)
            .then((results) => {
                req.session.sigId = results.rows[0].id;
                res.redirect("/petition/signed");
            })
            .then(() => {
                clearCache();
            })
            .catch((err) =>  {
                console.log(err);
            });
    })
;


router.route("/delete")

    .get((req, res) => {
        let id = req.session.user.id;

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
        let num = {},
            id = req.session.user.id,
            img;

        countRows()
            .then((results) => {
                num.count = results.rows[0].count;
            })
            .then (() => {
                console.log(id);
                getSignature(id)

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

        getCache()
            .then((data) => {
                if (data == null) {
                    getNames()
                        .then((results) => {
                            setCache(results)
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
