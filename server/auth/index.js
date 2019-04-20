const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../db/connection');
const users = db.get('users');
users.createIndex('username', {unique: true});

const router = express.Router();

const schema = Joi.object().keys({
    username: Joi.string().regex(/(^[a-zA-Z0-9_]+$)/).min(2).max(30).required(),
    password: Joi.string().trim().min(10).required()
});

function createTokenSendResponse(user,res, next) {
    const payload = {
        _id: user._id,
        username: user.username
    };
    jwt.sign(payload,process.env.TOKEN_SECRET,{
        expiresIn: '1d'
    }, (err, token) => {
        if(err) {
            respondError422(res, next);
        } else {
            res.json({
                token
            });
        }
    })
}

router.get('/', (req, res) => {
    res.json({
        message: 'auth route'
    });
});

router.post('/signup', (req, res, next) =>{
    console.log(req.body);
    const user = req.body;
    const result = Joi.validate(user, schema);
    if(result.error === null) {
        // make sure username is unique
        users.findOne({
            username: user.username
        }).then(existingUser => {
            // if user is null, username is not in the db, otherwise duplicate user detected
            if(existingUser) {
                // already a user  with username
                const err = new Error(`A user with username "${user.username}" already exists. Please choose another one.`)
                res.status(409);
                next(err);
            } else {
                // hash password
                bcrypt.hash(user.password.trim(),12).then(hashedPassword => {
                    const newUser = {
                        username: user.username,
                        password: hashedPassword
                    }
                    users.insert(newUser).then(insertedUser => {
                        // remove password from response object
                        // delete insertedUser.password;
                        // res.json(insertedUser);
                        createTokenSendResponse(insertedUser, res, next);
                    });
                });
            }
        })
    } else {
        res.status(422);
        next(result.error);
    }
});

function respondError422(res, next) {
    res.status(422);
    const error = new Error('Unable to login.');
    next(error);
}

router.post('/login', (req, res, next) => {
    const user = req.body;
    const result = Joi.validate(user, schema);
    if(result.error === null) {
        users.findOne({
            username: user.username
        }).then(existingUser => {
            if(existingUser) {
                // found user
                // compare password
                bcrypt.compare(user.password, existingUser.password).then(result => {
                    if (result) {
                        // correct information
                        // generate JWT
                        createTokenSendResponse(user, res, next);
                    } else {
                        respondError422(res, next)
                    }
                })
            } else {
                // user doesn't exist with username.
                respondError422(res, next)
            }
        })
    } else {
        res.status(422);
        respondError422(res, next)
    }
});

module.exports = router;