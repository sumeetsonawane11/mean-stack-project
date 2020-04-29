// Controller acts as a middleware with the business logic seperated
const User = require('../models/user.model');    
const bcrypt = require('bcryptjs');// Package for encrption of the password
const jwt = require('jsonwebtoken');


exports.CreateUser =  (req, res, next) => {
    // This is used to encrypt the password
    bcrypt.hash(req.body.password,10)
    .then(hash => {
        const user = new User({
            email:req.body.email,
            password: hash
        });   
        user.save()
        .then((result)=> {
            res.status(201).json({
                message : 'User Created successfully',
                result : result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
    });
};

exports.LoginUser =  (req, res, next)  => {
    let fetchedUser;
    User.findOne({ email: req.body.email})
    .then(user => {
        if(!user){ // If user does not exists, Auth failed
            return res.status(401).json({
                message : 'Invalid Authentication credentials'
            })
        }
        fetchedUser = user; // If user found
        // bcrypt compares the password by comparing the password hash of the request and the database hash value
        return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
        if(!result){ // If password does not match
            return res.status(401).json({
                message : 'Invalid Authentication credentials'
            })
        }
        const token = jwt.sign( // If password matched, create token 
                { email: fetchedUser.email, userId: fetchedUser._id},
                'secret_this_should_be_longer',
                { expiresIn : '1h'}            
            );
        return res.status(200).json({
            token : token,
            expiresIn : 3600,
            userId : fetchedUser._id
        })
    })
    .catch(err => {
        return res.status(401).json({
            message : 'Invalid Authentication credentials',
            error : err
        })
    })
};