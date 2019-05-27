const express = require('express');
const app = express();
var fs=require('fs');
var assert = require('assert');
var path = require("path");
// const cors = require("cors");

//connect  to db
let db;


// const MongoClient = require('mongodb').MongoClient;

const port=8080; 
// funny when using port 8080 it works
// when . using port 5501 it doesn't work. 

const mongodb= require('mongodb');
const MongoClient = mongodb.MongoClient;
const uri = "mongodb+srv://tintinthong:H-i5JBrKh-Xp3%21-@cluster0-duqpt.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
    if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
    }
    db= client.db("Cluster0");
    
    
    app.listen(port, ()=> console.log(`Example app listening on port ${port}!`))
    
})


app.get('/', function(req, res) {
    
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/postFile', (req, res) => {
    const click = {clickTime: new Date()};
    
    // console.log(click);
    // console.log(db);
    
    // db.collection('clicks').save(click, (err, result) => {
    //     if (err) {
    //         return console.log(err);
    //     }
    //     console.log('click added to db');
    //     res.sendStatus(201);
    // });
    
    var bucket = new mongodb.GridFSBucket(db);
    fs.createReadStream('./somevideo.mp4')
    .pipe(bucket.openUploadStream('video.mp4'))
    .on('error', function(error) {
        assert.ifError(error);
    })
    .on('finish', function() {
        console.log('done!');
        res.sendStatus(201);
        process.exit(0);
    }); 
    
    
});


app.get('/getFile', function(req,res){
    
    var bucket = new mongodb.GridFSBucket(db);
    bucket.openDownloadStreamByName('video.mp4').
    pipe(fs.createWriteStream('./output.mp4')).
    on('error', function(error) {
        assert.ifError(error);
    }).
    on('finish', function() {
        console.log('done!');
        res.sendStatus(201);
        process.exit(0);
    });
    
    
});




// app.listen(port, () => console.log(`Example app listening on port ${port}!`))


// https://gist.github.com/aerrity/fd393e5511106420fba0c9602cc05d35