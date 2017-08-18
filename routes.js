const {getHash, addUser, addSignature, countRows, getNames} = require("./dbqueries.js");
const {hashPassword, checkPassword} = require("./hashing.js");

module.exports = (app) => {

    //GET REQUESTS
    app.get("/register", (req, res) => {
        res.render("register", {});
    });

    app.get("/login", (req, res) => {
        res.render("login", {});
    });

    app.get("/petition", (req, res) => {
        res.render("petition", {});
    });

    app.get("/petition/signed", (req, res) => {
        let num = {};
        countRows()
            .then((results) => {
                num.count = results.rows[0].count;
                console.log(num);
            }).catch(function(err) {
                console.log(err);
            });
        res.render("signed", {
            signatures : num,
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

    //POST REQUESTS
    app.post("/register", (req, res) => {

        hashPassword(req.body.pwReg)
            .then((hash) => {
                let data = [req.body.firstReg, req.body.lastReg, req.body.emailReg, hash];
                addUser(data)
                    .then((results) => {
                        console.log(results.rows[0].id);
                        req.session.isLoggedin = results.rows[0].id;
                        res.redirect("/petition");
                    })
                    .catch( (err) => {
                        console.log(err);
                    });
            });
    });

    app.post("/login", (req, res) => {

        getHash(req.body.emailLog)
            .then((hash) => {
                console.log(hash);
                checkPassword(req.body.pwLog, hash.pw)
                    .then((result) => {
                        console.log(result);
                        if(result) {
                            res.redirect("/petition");

                        } else {
                            console.log("wrong password");
                            res.redirect("/login");
                        }
                    });
                req.session.isLoggedin = hash.id;
            });

    });

    app.post("/petition", (req, res) => {
        let data = [req.body.first, req.body.last, req.body.signature, req.session.isLoggedin];

        addSignature(data)
            .then(function(results) {
                if(data[0] != "" && data[1] != "" && data[2] != "") {
                    req.session.sigId = results.rows[0].id;
                    res.redirect("/petition/signed");
                    res.send();
                }
            }).catch(function(err) {
                console.log(err);
            });
    });


};
