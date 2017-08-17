const {addSignature, countRows, getNames} = require("./dbqueries.js");

module.exports = (app) => {

    //GET REQUESTS
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
    app.post("/petition", (req, res) => {
        let data = [req.body.first, req.body.last, req.body.signature];

        addSignature(data)
            .then(function(results) {
                if(data[0] != "" && data[1] != "" && data[2] != "") {
                    console.log(results.rows[0].id);
                    req.session.sigId = results.rows[0].id;
                    console.log(req.session.sigId);
                    res.redirect("/petition/signed");
                    res.send();
                }
            }).catch(function(err) {
                console.log(err);
            });
    });

};
