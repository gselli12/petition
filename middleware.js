//REQUIRING

var session = require('express-session'),
    Store = require('connect-redis')(session);

let secret;
if(process.env.COOKIE_SECRET) {
    secret = process.env.COOKIE_SECRET;
} else {
    const secrets = require("./secrets.json");
    secret = secrets.secret;
}



//MIDDLEWARE

module.exports = (app) => {




    app.use(require("cookie-parser")());

    app.use(require("body-parser").urlencoded({
        extended: false
    }));

    app.use(session({
        store: new Store({
            ttl: 3600,
            host: 'localhost',
            port: 6379
        }),
        resave: false,
        saveUninitialized: true,
        secret: 'my super fun secret'
    }));

    // app.use((req, res, next) => {
    //     if (req.session.sigId && req.url == "/petition") {
    //         res.redirect("/petition/signed");
    //     } else {
    //         next();
    //     }
    // });
    //
    // app.use((req, res, next) => {
    //     if( !req.session.id && req.url !== "/register" && req.url !== "/login") {
    //         res.redirect("/register");
    //     } else if (req.session.id && (req.url == "/register" || req.url == "/login")) {
    //         res.redirect("/petition");
    //     } else {
    //         next();
    //     }
    // });

};
