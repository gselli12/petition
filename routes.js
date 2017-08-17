//REQUIRING
var express = require('express');
var exphbs = require('express-handlebars');
var app = express();
//const {addSignature, countRows, getNames} = require("./dbqueries.js");
var cookieSession = require('cookie-session');
const secrets = require("./secrets.json");
//SETUP HANDLEBARS
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//MIDDLEWARE
app.use(express.static(__dirname + "/public"));

app.use(require("cookie-parser")());

app.use(require("body-parser").urlencoded({
    extended: false
}));

app.use(cookieSession({
    secret: secrets.secret,
    maxAge: 1000 * 60 * 60 * 24 * 14
}));

app.use((req, res, next) => {
    if (req.session.sigId && req.url == "/petition") {
        res.redirect("/petition/signed");
    } else {
        next();
    }
});

//GET REQUESTS
app.get("/petition", (req, res) => {
    res.render("petition", {});
});

app.get("/petition/signed", (req, res) => {
    let num = {};
    //countRows(num);
    db.query('SELECT COUNT(*) FROM signatures;')
        .then((results) => {
            //console.log(results.rows[0].count);
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
    db.query('SELECT first, last FROM signatures;')
        .then((results) => {
            obj = results.rows;
            res.render("signers", {
                names: obj,
            });
        });
});
//TEST
const spicedPG = require("spiced-pg");
const login = require("./secrets.json");

const db = spicedPG("postgres:" + login.username + ":" + login.password + "@localhost:5432/petition");

//POST REQUESTS
app.post("/petition", (req, res) => {
    let data = [req.body.first, req.body.last, req.body.signature];

    db.query('INSERT INTO signatures (first, last, signature) VALUES ($1, $2, $3) RETURNING id ', data )
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

app.listen(8080, () => {
    console.log("listening on port 8080");
});
