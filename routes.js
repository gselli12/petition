var express = require('express');
var exphbs = require('express-handlebars');
var app = express();
const {addSignature} = require("./dbqueries.js");


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
    let data = [req.body.first, req.body.last, req.body.signature];
    addSignature(data, res);
});

app.get("/petition/signed", (req, res) => {
    res.render("signed", {});
});





app.listen(8080, () => {
    console.log("listening on port 8080");
});
