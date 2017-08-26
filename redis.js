var redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL || {host:'localhost', port: 6379});

// var session = require('express-session'),
//     Store = require('connect-redis')(session);
//
// var store = {};
// if(process.env.REDIS_URL) {
//     store = {
//         url: process.env.REDIS_URL
//     };
// } else {
//     store = {
//         ttl: 3600,
//         host: 'localhost',
//         port: 6379,
//     };
// }

// app.use(session({
//     store: new Store(store),
//     resave: true,
//     saveUninitialized: true,
//     secret: secret
// }));


client.on('error', function(err) {
    console.log(err);
});


let getCache = () => {
    return new Promise((resolve, reject) => {
        client.get("cache", (err, data) => {
            if(err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
};

let setCache = (results) => {
    return new Promise((resolve, reject) => {
        client.set("cache", JSON.stringify(results.rows), (err) => {
            if (err) {
                reject(console.log(err));
            } else {
                resolve(console.log("cache was successfully sent"));
            }
        });
    });
};


let clearCache = () => {
    return new Promise((resolve, reject) => {
        client.set("cache", JSON.stringify(null), (err) => {
            if (err) {
                reject(console.log(err));
            } else {
                resolve(console.log("cache was successfully cleared"));
            }
        });
    });
};

let getLoginCheck = () => {
    return new Promise((resolve, reject) => {
        client.get("loginCheck", (err, data) => {
            if (err) {
                reject(console.log(err));
            } else {
                if (JSON.parse(data) == null) {
                    client.setex("loginCheck", 60,JSON.stringify(0), (err) => {
                        if (err) {
                            reject((console.log(err)));
                        } else {
                            console.log("loginCheck set to 0");
                            resolve(0);
                        }
                    });
                } else {
                    resolve(JSON.parse(data));
                }
            }
        });
    });
};

let incrementLoginCheck = (data) => {
    return new Promise((resolve, reject) => {
        client.setex("loginCheck", 60 ,JSON.stringify(data + 1), (err) => {
            if (err) {
                reject(console.log(err));
            } else {
                resolve(console.log("loginCheck incremented by 1"));
            }
        });
    });
};



module.exports.incrementLoginCheck = incrementLoginCheck;
module.exports.getLoginCheck = getLoginCheck;
module.exports.clearCache = clearCache;
module.exports.getCache = getCache;
module.exports.setCache = setCache;
