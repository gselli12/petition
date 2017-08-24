var redis = require('redis');
var client = redis.createClient({
    host: 'localhost',
    port: 6379
});

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


module.exports.clearCache = clearCache;
module.exports.getCache = getCache;
module.exports.setCache = setCache;
