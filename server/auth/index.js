const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: 'auth route'
    });
});

router.post('/signup', (req, res) =>{

    console.log(req.body);
    res.json({
        message: 'signed up'
    });
});

module.exports = router;