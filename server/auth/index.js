const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');

const db = require('../db/connection');
const users = db.get('users');
users.createIndex('username', {unique: true});

const router = express.Router();

const schema = Joi.object().keys({
    username: Joi.string().regex(/(^[a-zA-Z0-9_]+$)/).min(2).max(30).required(),
    password: Joi.string().trim().min(10).required()
});

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
                next(err);
            } else {
                // hash password
                bcrypt.hash(user.password,12).then(hashedPassword => {
                    const newUser = {
                        username: user.username,
                        password: hashedPassword
                    }
                    users.insert(newUser).then(insertedUser => {
                        // remove password from response object
                        delete insertedUser.password;
                        res.json(insertedUser);
                    });
                });
                // insert user
            }
        })
    } else {
        next(result.error);
    }
});

module.exports = router;