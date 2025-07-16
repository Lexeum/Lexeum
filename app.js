const express = require('express');
const session = require('express-session');
const dashboardRouter = require('./routes/dashboard');
const logoutRouter = require('./routes/logout');

const app = express();

app.use(session({
    secret: 'tu_secreto',
    resave: false,
    saveUninitialized: false
}));

app.use('/dashboard', dashboardRouter);
app.use('/logout', logoutRouter);

module.exports = app;