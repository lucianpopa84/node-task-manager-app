const express = require('express');
require('./db/mongoose'); // connect to mongodb database
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server is started on port ${port}`);
});