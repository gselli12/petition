const spicedPG = require("spiced-pg");
const login = require("./secrets.json");

const db = spicedPG("postgres:" + login.username + ":" + login.password + "@localhost:5432/petition");

var addSignature = (data, res) => {
    db.query('INSERT INTO signatures (first, last, signature) VALUES ($1, $2, $3)', data ).then(function(results) {
        if(data[0] != "" && data[1] != "" && data[2] != "") {
            console.log(results);
            res.cookie("MyCookie", "1");
            res.redirect("/petition/signed");
            res.send();
        }
    }).catch(function(err) {
        console.log(err);
    });
};

module.exports.addSignature = addSignature;
