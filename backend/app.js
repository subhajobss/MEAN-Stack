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

MongoClient.connect(url,(error,database) => {
    if(error){
        return console.log(error);
    }
    const db = database.db('subha_test');
    db.collection('posts').insertOne(
    {
        title:'123',content:'123'
    },
    function(err,res){
        if(err){
            database.close();
            return console.log(err);
        }
        database.close();
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

app.post("/api/posts", (req,res,next) => {
    //const post = req.body;
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save();
    console.log(post);
    res.status(201).json({
        message : 'Post added Successfully!'
    });
});

app.get('/api/posts/',(req,res,next) =>{
    const posts = [
        {id:'1', title:'post1', content:'Content1'},
        {id:'2', title:'post2', content:'Content2'},
        {id:'3', title:'post3', content:'Content3'}
    ];
    res.status(200).json({
        message:'Posts fetched successfully',
        posts : posts
    });    
});

module.exports = app;