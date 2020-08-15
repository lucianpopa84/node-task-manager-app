const express = require('express');
const path = require('path');
const hbs = require('hbs');
require('./templates/helpers/minwidth'); // import handelbars helpers
const cookieParser = require('cookie-parser');
require('./db/mongoose'); // connect to mongodb database
// api routes
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
// hbs template routes
const tasksRouter = require('./routers/render/tasks');
const aboutRouter = require('./routers/render/about');
const loginRouter = require('./routers/render/login');
const signupRouter = require('./routers/render/signup');

const app = express();

// define paths for express config
const publicPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, './templates/views');
const partialsPath = path.join(__dirname, './templates/partials');

// setup handelbars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// setup static directory to serve (css, jpg, png)
app.use(express.static(publicPath));

// parses incoming requests with URL-encoded payloads
app.use(express.urlencoded({
    extended: false
}))

// parses incoming requests with JSON payloads
app.use(express.json());

// parses cookies
app.use(cookieParser(process.env.SESSION_SECRET));

app.use(userRouter);
app.use(taskRouter);

app.use(tasksRouter);
app.use(aboutRouter);
app.use(loginRouter);
app.use(signupRouter);

module.exports = app;