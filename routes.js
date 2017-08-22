const {deleteSignature, updateUser, getUserData, getNamesByCity, addInfo, getSignature, getHash, addUser, addSignature, countRows, getNames} = require("./dbqueries.js");

const {hashPassword, checkPassword} = require("./hashing.js");

var express = require("express");
var router = express.Router();

router.route("/register")

    .get((req, res) => {
        res.render("register", {});
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
                            error: "Something went wrong, try again"
                        });
                    });
            });
    })
;

router.route("/login")

    .get((req, res) => {
        res.render("login", {});
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
                });
            });
    })
;

router.route("/profile")

    .get((req, res) => {
        res.render("profile", {});
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

    .get((req,res) => {
        let id = req.session.id;
        getUserData(id)
            .then((results) => {
                res.render("edit", {
                    info: results.rows[0]
                });
            });
    })

    .post((req,res) => {
        let data = [req.body.firstEdit, req.body.lastEdit, req.body.mailEdit, req.body.pwEdit, req.body.ageEdit, req.body.cityEdit, req.body.urlEdit];

        let id = req.session.id;

        updateUser(data, id)

            .then(() => {
                res.redirect("/petition");
            })
            .catch((err) => {
                console.log(err);
            });

    })
;

router.route("/petition")

    .get((req, res) => {
        res.render("petition", {});
    })

    .post((req, res) => {
        let data = [req.body.signature, req.session.id];

        addSignature(data)
            .then(function(results) {
                req.session.sigId = results.rows[0].id;
                res.redirect("/petition/signed");
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
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            });
    })
;

router.route("/petition/signers")

    .get((req, res) => {
        let obj = [];
        getNames()
            .then((results) => {
                obj = results.rows;
                res.render("signers", {
                    names: obj,
                });
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
