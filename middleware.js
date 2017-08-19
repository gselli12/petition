//REQUIRING
//var express = require('express');
var cookieSession = require('cookie-session');
const secrets = require("./secrets.json");

//MIDDLEWARE

module.exports = (app) => {


    app.use(require("cookie-parser")());

    app.use(require("body-parser").urlencoded({
        extended: false
    }));

    app.use(cookieSession({
        secret: secrets.secret,
        maxAge: 1000 * 60 * 60 * 24 * 14
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
