var express = require('express');
var exphbs = require('express-handlebars');
var app = express();
//const {insertData} = require("./dbqueries.js");

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
    res.json(req.body);
    //insertData();
});





app.listen(8080, () => {
    console.log("listening on port 8080");
});
