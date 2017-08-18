const spicedPG = require("spiced-pg");
const login = require("./secrets.json");

const db = spicedPG("postgres:" + login.username + ":" + login.password + "@localhost:5432/petition");


var addSignature = (data) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO signatures (first, last, sig, user_id) VALUES ($1, $2, $3, $4) RETURNING id ', data, (err, results) => {
            if (results) {
                resolve(results);
            } else {
                reject("error");
            }
        } );
    });
};

var addUser = (data) => {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO users (first, last, email, pw) values ($1, $2, $3, $4) RETURNING id;", data, (err, results) => {
            if (results) {
                resolve(results);
            } else {
                reject("error add User");
            }
        });
    });
};

var getHash = (email) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT pw, id FROM users WHERE email = '" + email +"';", null, (err, results) => {
            if (results) {
                console.log(results.rows[0].id);
                resolve(results.rows[0]);
            } else {
                reject("error at getting hash");
            }
        });
    });
};

var countRows = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT COUNT(*) FROM signatures;', null, (err, results) => {
            if (results) {
                resolve(results);
            } else {
                reject("error");
            }
        });
    });
};

var getNames = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT first, last FROM signatures;', null, (err, results) => {
            if(results) {
                resolve(results);
            } else {
                reject("error");
            }
        });
    });
};

module.exports.getHash = getHash;
module.exports.addUser = addUser;
module.exports.getNames = getNames;
module.exports.countRows = countRows;
module.exports.addSignature = addSignature;
