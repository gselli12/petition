const {getNamesByCity, addInfo, getSignature, getHash, addUser, addSignature, countRows, getNames} = require("./dbqueries.js");
const {hashPassword, checkPassword} = require("./hashing.js");

module.exports = (app) => {

    //GET REQUESTS
    app.get("/register", (req, res) => {
        res.render("register", {});
    });

    app.get("/login", (req, res) => {
        res.render("login", {});
    });

    app.get("/profile", (req, res) => {
        res.render("profile", {});
    });

    app.get("/petition", (req, res) => {
        res.render("petition", {});
    });

    app.get("/petition/signed", (req, res) => {
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
    });

    app.get("/petition/signers", (req, res) => {
        let obj = [];
        getNames()
            .then((results) => {
                obj = results.rows;
                res.render("signers", {
                    names: obj,
                });
            });
    });

    app.get("/petition/:city", (req, res) => {
        let city = req.params.city;
        getNamesByCity(city)
            .then((results) => {
                res.render("city", {
                    city: req.params.city,
                    info: results.rows,
                });
            });
    });

    //POST REQUESTS
    app.post("/register", (req, res) => {

        hashPassword(req.body.pwReg)
            .then((hash) => {
                let data = [req.body.firstReg, req.body.lastReg, req.body.emailReg, hash];
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
    });

    app.post("/profile", (req, res) => {
        let data = [req.body.ageProfile, req.body.cityProfile, req.body.urlProfile, req.session.id];
        if (data[0] == "") {
            data[0] = null;
        }
        addInfo(data)
            .then((result) => {
                res.redirect("/petition");
            })
            .catch((err) => {
                console.log(err);
            });

    });

    app.post("/login", (req, res) => {

        getHash(req.body.emailLog)
            .then((hash) => {
                checkPassword(req.body.pwLog, hash.pw)
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
    });

    app.post("/petition", (req, res) => {
        let data = [req.body.signature, req.session.id];

        addSignature(data)
            .then(function(results) {
                req.session.sigId = results.rows[0].id;
                res.redirect("/petition/signed");
            }).catch((err) =>  {
                console.log(err);
            });
    });


};
