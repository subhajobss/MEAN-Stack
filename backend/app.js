/* // this file is the listener (middleware) for incoming request.
const express = require('express');

const app = express();

app.use((req, res, next) => {
    console.log('First Middleware');   
// To call next middleware to process the request further. 
// If next is not called in the middleware, the execution of request will be stopped
next();   
}); 
app.use('api/posts',(req, res, next) =>{
    // In this middleware , we are sending request to nodejs.
   // res.send('Hello from Express');
});
//export app.js to be able to use outside

module.exports = app; */

const express = require('express');
const bodyParser = require("body-parser");
const app = express();

// for DB connection
const Post = require('./models/post');
const MongoClient = require('mongodb').MongoClient; 
const url = 'mongodb://subhashini:mlab123@ds137763.mlab.com:37763/subha_test';
var db = '';
MongoClient.connect(url,(error,database) => { 
    if(error){
        return console.log(error);
    }
    db = database.db('subha_test');
    db.collection('posts').insertOne(
    {
        title:'123',content:'789'
    },
    function(err,res){
        if(err){
            database.close();
            return console.log(err);
        }
       // database.close();
    });

    //To find the inserted documents, store collections first. then collection.find
    const collection = db.collection('posts');
    console.log('connected');
    collection.find({}).toArray((err,docs)=>{
        console.log('Found the following records');
        console.log(docs);
    })
  
});

// below line parses all the incoming request into valid json data.
app.use(bodyParser.json());

// to parse url encoded data :   app.use(bodyParser.urlencoded({extended : false}))

app.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods","GET, POST, PATCH, DELETE, OPTIONS");
    next();
});

// app.post("/api/posts", (req,res,next) => {
//     //const post = req.body;
//     const post = new Post({
//         title: req.body.title,
//         content: req.body.content
//     });
//     post.save();
//     console.log(post);
//     res.status(201).json({
//         message : 'Post added Successfully!'
//     });
// });
app.post("/api/posts", (req, res, next) => {
    console.log('ADDing@@@@@@@@@@@@');
    
    const post = new Post({
      title: req.body.title,
      content: req.body.content
    });
    const collection = db.collection('posts');
   // collection.insertOne(post)
    collection.insertOne(post).then(createdPost => {
        console.log('DB ',createdPost);
      res.status(201).json({
        message: "Post added successfully",
        postId: createdPost._id
      });
    });
  });
  
 
app.get('/api/posts',(req,res,next) =>{
    const collection = db.collection('posts');
    collection.find({}).toArray((err,docs)=>{
        console.log('Found the following records');
        console.log(docs);
        res.status(200).json({
                    message:'Posts fetched successfully',
                   posts : docs
       });
    })
    // Post.find().then( documents => {
    //     console.log('doc',documents);
    //     res.status(200).json({
    //         message:'Posts fetched successfully',
    //         posts : documents
    //     });
    // });
      
});

app.delete('/api/posts/:id',(req,res,next)=>{
    console.log(req.params.id);
    res.status(200).json({message : 'Post Deleted!'});
})
module.exports = app;