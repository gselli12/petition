var express = require('express');
var exphbs = require('express-handlebars');
var app = express();

//REQUIRING everything realted to queries! Move later to seperate file
const spicedPG = require("spiced-pg");
const login = require("./secrets.json");

const db = spicedPG("postgres:" + login.username + ":" + login.password + "@localhost:5432/petition");
//END OF REQUIRING query stuff!



app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(require("body-parser").urlencoded({
    extended: false
}));

app.use(express.static(__dirname + "/public"));





app.get("/petition", (req, res) => {
    res.render("petition", {});
});

app.post("/petition", (req, res) => {
    //res.json(req.body);
    let data = [req.body.first, req.body.last, req.body.signature];
    db.query('INSERT INTO signatures (first, last, signature) VALUES ($1, $2, $3)', data ).then(function(results) {
        if(req.body.first != "" && req.body.last != "" && req.body.signature != "") {
            console.log(results);
            res.cookie("MyCookie", "1");
            res.redirect("/petition/signed");
            res.send();
        }
    }).catch(function(err) {
        console.log(err);
    });
});

app.get("/petition/signed", (req, res) => {
    res.render("signed", {});
});





app.listen(8080, () => {
    console.log("listening on port 8080");
});
