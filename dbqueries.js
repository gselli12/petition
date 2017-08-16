const spicedPG = require("spiced-pg");
const secrets = require("secrets.json");

const db = spicedPg("postgres://${secrets.username}:${secrets.password}@localhost:5432/petition");

var insertData = () =>{
    db.query('INSERT INTO signatures (first, last, signature) VALUES ('$("#first-name").val()', '$("#last-name").val()', '$("#hidden").val()');').then(function(results) {
        console.log(results.rows);
    }).catch(function(err) {
        console.log(err);
    });
};


//create module called db queries, that makes all your db queries.

modeul.exports.insertData = insertData;
