var express = require('express');
var exphbs = require('express-handlebars');
var app = express();
const {addSignature, countRows, getNames} = require("./dbqueries.js");

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


app.use(require("body-parser").urlencoded({
    extended: false
}));

app.use(require("cookie-parser")());

app.use((req, res, next) => {
    if (req.cookies.MyCookie == "1" && req.url == "/petition") {
        res.redirect("/petition/signed");
    } else {
        next();
    }
});

app.use(express.static(__dirname + "/public"));



app.get("/petition", (req, res) => {
    res.render("petition", {});
});

app.post("/petition", (req, res) => {
    let data = [req.body.first, req.body.last, req.body.signature];
    addSignature(data, res);
});

app.get("/petition/signed", (req, res) => {
    let num = {};
    countRows(num);
    res.render("signed", {
        signatures : num,
    });
});

app.get("/petition/signers", (req, res) => {
    let obj = [];
    getNames(obj, res);
});


app.listen(8080, () => {
    console.log("listening on port 8080");
});
