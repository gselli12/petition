//REQUIRING STUFF
var express = require('express');
var exphbs = require('express-handlebars');
var app = express();
const middleware = require("./middleware.js");
const routes = require("./routes.js");

//SETUP HANDLEBARS
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + "/public"));
//MIDDLEWARE
middleware(app);


//ROUTES
routes(app);

const port = 8080;
app.listen(port, () => {
    console.log("listening on port 8080");
});
