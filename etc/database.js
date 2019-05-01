var MongoClient = require('mongodb').MongoClient;
//Create a database named "line":
var url = "mongodb://localhost:27017/line";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});
