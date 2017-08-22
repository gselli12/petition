const spicedPG = require("spiced-pg");
const login = require("./secrets.json");

const db = spicedPG("postgres:" + login.username + ":" + login.password + "@localhost:5432/petition");

var addUser = (data) => {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO users (first, last, email, pw) values ($1, $2, $3, $4) RETURNING id, email;", data, (err, results) => {
            if (results) {
                resolve(results);
            } else {
                reject("error add User");
            }
        });
    });
};

var getUserData = (id) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT users.first, users.last, users.email, users.pw, profile.age, profile.city, profile.url FROM users JOIN profile ON users.id = profile.user_id WHERE users.id = '" + id + "';", null, (err, results) => {
            if(results) {
                console.log(results); 
                resolve(results);
            } else {
                reject("error getting user data");
            }
        });
    });
};

// var updateUser = (data) => {
//     return new Promise((resolve, reject) => {
//         db.query("")
//     })
// }


var getHash = (email) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT pw, id FROM users WHERE email = '" + email +"';", null, (err, results) => {
            if (results) {
                resolve(results.rows[0]);
            } else {
                reject("error at getting hash");
            }
        });
    });
};


var addInfo = (data) => {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO profile (age, city, url, user_id) values ($1, $2, $3, $4)", data, (err, results) => {
            if (results) {
                resolve(results);
            } else {
                reject(err, "error at addInfo");
            }
        });
    });
};


var addSignature = (data) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO signatures (sig, user_id) VALUES ($1, $2) RETURNING id;', data, (err, results) => {
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


var getSignature = (id) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT sig FROM signatures WHERE user_id = '" + id + "';", null, (err, results) => {
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
        db.query('SELECT users.first, users.last, profile.age, profile.city, profile.url FROM signatures JOIN users ON users.id = signatures.user_id JOIN profile ON users.id = profile.user_id;', null, (err, results) => {
            if(results) {
                resolve(results);
            } else {
                reject("error");
            }
        });
    });
};


var getNamesByCity = (input) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT users.first, users.last, profile.age FROM signatures JOIN users ON users.id = signatures.user_id JOIN profile ON users.id = profile.user_id WHERE profile.city = '" + input + "';", null, (err, results) => {
            if (results) {
                resolve(results);
            } else {
                reject("error at getNamesByCity");
            }
        });
    });
};

module.exports.getUserData = getUserData;
module.exports.getNamesByCity = getNamesByCity;
module.exports.addInfo = addInfo;
module.exports.getSignature = getSignature;
module.exports.getHash = getHash;
module.exports.addUser = addUser;
module.exports.getNames = getNames;
module.exports.countRows = countRows;
module.exports.addSignature = addSignature;
