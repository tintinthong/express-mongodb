const express = require('express');
const app = express();
var fs=require('fs');
var path = require("path");
var cors= require("cors");
var request=require("request") // to use browser and download?
const port=8080; 
// funny when using port 8080 it works
// when . using port 5501 it doesn't work. 

const mongodb= require('mongodb');
const MongoClient = mongodb.MongoClient;
const uri = "mongodb+srv://tintinthong:H-i5JBrKh-Xp3%21-@cluster0-duqpt.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });

// //handle cross origin requiues
// function handleCors(req, res, callback) {

//     res.setHeader('Access-Control-Allow-Origin', '*')
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE,OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Authorization');

//     // CORS OPTIONS request, simply return 200
//     if (req.method == 'OPTIONS') {
//         res.statusCode = 200;
//         res.end();
//         callback.onOptions();
//         return;
//     }

//     callback.onContinue();
// };

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); // * => allow all origins
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Auth-Token, Accept'); // add remove headers according to your needs
    next()
})

// app.use(cors())

//connect  to db
let db;

client.connect(err => {
    if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
    }
    db= client.db("Cluster0");
    
    
    
})



app.get('/', function(req, res) {
    
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/postFile', (req, res) => {
    
    
    
    // const click = {clickTime: new Date()};
    // console.log(click);
    // console.log(db);
    
    // db.collection('clicks').save(click, (err, result) => {
    //     if (err) {
    //         return console.log(err);
    //     }
    //     console.log('click added to db');
    //     res.sendStatus(201);
    // });
    
    let stream = bucket = new mongodb.GridFSBucket(db);
    fs.createReadStream('./upload/somevideo.mp4')
    .pipe(bucket.openUploadStream('video.mp4'))
    .on('error', function(error) {
        assert.ifError(error);
    })
    .on('finish', function() {
        console.log('done!  resource  downloaded to server');
        res.sendStatus(201);
        // process.exit(0);
    });
    
    
});


app.get('/getFile', function(req,res){
    
    
    var bucket = new mongodb.GridFSBucket(db);
    let stream = bucket.openDownloadStreamByName('video.mp4').
    pipe(fs.createWriteStream('./download/output.mp4')).
    on('error', function(error) {
        assert.ifError(error);
    }).
    on('finish', function() {
        console.log('done!');
      
        let pathToFile =path.join(__dirname, 'output.mp4')
        res.sendFile(pathToFile);
        res.sendStatus(201);
        // process.exit(0);
    });

    // //send  stream 
    // res.send(stream).on('finish',function(){
    //     res.end('ended')
    // });
    //https://stackoverflow.com/questions/25463423/res-sendfile-absolute-path


});

app.get('/downloadFile', function(req,res){
    
    const file = `${__dirname}/upload/somevideo.mp4`;
    res.download(file, ()=>{
        console.log("file downloaded")
    });
    
    var fileContents = Buffer.from(fileData, "base64");
    
    var readStream = new stream.PassThrough();
    readStream.end(fileContents);
    
    response.set('Content-disposition', 'attachment; filename=' + fileName);
    response.set('Content-Type', 'text/plain');
    
    readStream.pipe(res);
    
    
});


app.listen(port, ()=> console.log(`Example app listening on port ${port}!`))

//https://stackoverflow.com/questions/45812943/how-to-stream-from-nodejs-server-to-client
//https://stackoverflow.com/questions/45922074/node-express-js-download-file-from-memory-filename-must-be-a-string
//https://stackoverflow.com/questions/30985596/issue-with-downloading-a-file-from-gridfs-in-mongodb-nodejs-gridfs-stack



// app.listen(port, () => console.log(`Example app listening on port ${port}!`))


// https://gist.github.com/aerrity/fd393e5511106420fba0c9602cc05d35