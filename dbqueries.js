const spicedPG = require("spiced-pg");
const login = require("./secrets.json");

const db = spicedPG("postgres:" + login.username + ":" + login.password + "@localhost:5432/petition");


var addSignature = (data) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO signatures (first, last, signature) VALUES ($1, $2, $3) RETURNING id ', data, (err, results) => {
            if (results) {
                resolve(results);
            } else {
                reject("error");
            }
        } );
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


module.exports.getNames = getNames;
module.exports.countRows = countRows;
module.exports.addSignature = addSignature;
