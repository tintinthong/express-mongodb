const express = require("express");
const app = express();
var fs = require("fs");
var path = require("path");
var cors = require("cors");
var request = require("request"); // to use browser and download?

var Busboy = require("busboy");

const port = 8080;
// funny when using port 8080 it works
// when . using port 5501 it doesn't work.

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const uri =
"mongodb+srv://tintinthong:H-i5JBrKh-Xp3%21-@cluster0-duqpt.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });


let db;

client.connect(err => {
  if (err) {
    console.log("Error occurred while connecting to MongoDB Atlas...\n", err);
  }
  db = client.db("Cluster0");
});

app.get("/", function(req, res, bucket) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/hey", (req, res, bucket) => {
  res.send("HEYYY");
});

app.get("/myFile", (req, res) => {
  let pathToFile = path.join(__dirname, "output.mp4");
  console.log(pathToFile);
  res.download(pathToFile);
});

app.post("/postFile2", (req, res, bucket) => {
  var bucket = new mongodb.GridFSBucket(db);
  console.log("bucket", bucket);
  console.log(req.headers);
  const busboy = new Busboy({ headers: req.headers });
  req.pipe(busboy);
  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    console.log("FILENAME: ", filename);
    file
    .pipe(bucket.openUploadStream(filename))
    .on("error", err => {
      console.error("ERROR: ", err);
    })
    .on("finish", () => {
      console.log("DONE");
    });
  });
  
  
  busboy.on("finish", function() {
    res.statusCode = 200;
    res.send("BOOO");
    res.end();
  });
  
  // Pipe the HTTP Request into Busboy.
});

app.post("/postFile", (req, res) => {
  
  
  let stream = (bucket = new mongodb.GridFSBucket(db));
  fs.createReadStream("./upload/somevideo.mp4")
  .pipe(bucket.openUploadStream("video.mp4"))
  .on("error", function(error) {
    assert.ifError(error);
  })
  .on("finish", function() {
    console.log("done!  resource  downloaded to server");
    res.sendStatus(201);
    // process.exit(0);
  });
});

app.get("/getFile", function(req, res) {
  console.log(req.headers);
  let pathToFile = path.join(__dirname, "output.mp4");
  console.log(pathToFile);
  res.download(pathToFile);
});


app.get("/downloadFile", function(req, res) {
  const file = `${__dirname}/upload/somevideo.mp4`;
  console.log(file);
  res.download(file, () => {
    console.log("file downloaded");
  });
  
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

//https://stackoverflow.com/questions/45812943/how-to-stream-from-nodejs-server-to-client
//https://stackoverflow.com/questions/45922074/node-express-js-download-file-from-memory-filename-must-be-a-string
//https://stackoverflow.com/questions/30985596/issue-with-downloading-a-file-from-gridfs-in-mongodb-nodejs-gridfs-stack


