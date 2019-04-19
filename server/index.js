const express = require('express');
const volleyball = require('volleyball');

const app = express();

const auth = require('./auth/index.js');

app.use(volleyball);

app.use(express.json());

app.get('/', (req,res) => {
    res.json({
        message: 'Hello World!'
    });
});

app.use('/auth', auth);

function notFound(req, res, next) {
    res.status(404);
    const error = new Error('Not Found - ' + req.originalUrl);
    next(error);
}

function errorHandler(err, req, next) {
    res.status(res.statusCode || 500);
    res.jsonn({
        message: err.message,
        stack: err.stack
    });
}

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});