
//MIDDLEWARE

module.exports = (app) => {

    //REQUIRING

    let secret;
    if(process.env.COOKIE_SECRET) {
        secret = process.env.COOKIE_SECRET;
    } else {
        const secrets = require("./secrets.json");
        secret = secrets.secret;

    }

    app.use(require("cookie-parser")());

    app.use(require("body-parser").urlencoded({
        extended: false
    }));

    var session = require('express-session'),
        Store = require('connect-redis')(session);

    var store = {};
    if(process.env.REDIS_URL) {
        store = {
            url: process.env.REDIS_URL
        };
    } else {
        store = {
            ttl: 3600,
            host: 'localhost',
            port: 6379,
        };
    }

    app.use(session({
        store: new Store(store),
        resave: true,
        saveUninitialized: true,
        secret: secret
    }));





    app.use((req, res, next) => {
        if (req.session.sigId && req.url == "/petition") {
            res.redirect("/petition/signed");
        } else {
            next();
        }
    });

    app.use((req, res, next) => {
        console.log(req.session);
        if( !req.session.user && req.url !== "/register" && req.url !== "/login") {
            res.redirect("/register");
        } else if (req.session.user && (req.url == "/register" || req.url == "/login")) {
            res.redirect("/petition");
        } else {
            next();
        }
    });

};
