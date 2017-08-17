const spicedPG = require("spiced-pg");
const login = require("./secrets.json");

const db = spicedPG("postgres:" + login.username + ":" + login.password + "@localhost:5432/petition");

//this would require for you to create a new promise in the route when addSignature is called! Not working yet with promises
// var addSignature = (data) => {
//     db.query("INSERT INTO signatures (first, last, signature) VALUES ($1, $2, $3)", data );
// };

// var addSignature = (data, req, res) => {
//     db.query('INSERT INTO signatures (first, last, signature) VALUES ($1, $2, $3) RETURNING id ', data )
//         .then(function(results) {
//             if(data[0] != "" && data[1] != "" && data[2] != "") {
//                 console.log(results.rows[0].id);
//                 req.session.sigId = results.rows[0].id;
//                 // res.cookie("MyCookie", "1");
//                 // res.redirect("/petition/signed");
//                 // res.send();
//             }
//         }).catch(function(err) {
//             console.log(err);
//         });
// };

// var countRows = (num) => {
//     db.query('SELECT COUNT(*) FROM signatures;')
//         .then((results) => {
//             //console.log(results.rows[0].count);
//             num.count = results.rows[0].count;
//             console.log(num);
//         }).catch(function(err) {
//             console.log(err);
//         });
// };

//also requires a promise, so that res.render can go into the routes.js file
// var getNames = (obj, res) => {
//     db.query('SELECT first, last FROM signatures;')
//         .then((results) => {
//             obj = results.rows;
//             res.render("signers", {
//                 names: obj,
//             });
//         });
// };


// module.exports.getNames = getNames;
// module.exports.countRows = countRows;
//module.exports.addSignature = addSignature;
