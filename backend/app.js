const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
//creating an express app, returns an objects
const app = express();

//****Mongo DB connection
mongoose.connect('mongodb+srv://sumeet:'+ process.env.MONGO_ATLAS_PWD +'@mean-stack-cluster-xtpr2.mongodb.net/angular-node-projects',
 { useNewUrlParser: true }
 ).then(() =>{
    console.log('***********Connection to database established!***********')
})
.catch(() =>{
    console.log('Connection failed!')
})

// Parsing the request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

// Give access to the images path in the server folder and forward
// the url to the images relative to the server js file
app.use('/images', express.static(path.join('backend/images')));

// Setting headers and Access methods
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', "*"); // Resolves CORS issues
    res.setHeader(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );// If Url has some extra headers, add this, otherwise it will fail
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, PUT, DELETE, OPTIONS'
        );// The Verbs like GET POST allowed
    next();
});


// All routes starting with /api/posts will be forwaded in the postRoutes
app.use('/api/posts',postRoutes);

// All routes starting with /api/user will be forwaded in the userRoutes
app.use('/api/user', userRoutes);

//Export the whole express app to the server connection
module.exports = app;