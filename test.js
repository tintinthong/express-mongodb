
// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://tintinthong:H-i5JBrKh-Xp3!-@file-upload-download-duqpt.mongodb.net/test?retryWrites=true"
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://tintinthong:H-i5JBrKh-Xp3%21-@cluster0-duqpt.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
    if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
    }
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
});
