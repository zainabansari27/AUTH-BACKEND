const express = require('express');
const {connectDB} = require('./db/connection.js')
require('dotenv').config();
const cors = require('cors');
const bodyParser = require("body-parser");
const bycrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const authRouter = require('./routers/authentication.js');
//const loginRouter =require('./routers/login.js')
const cookieparser = require("cookie-parser");

const PORT = process.env.PORT || 7000;
const app = express();

app.use(bodyParser.json());
app.use(cookieparser());
app.use(cors());
app.use('/',authRouter);

app.get('/me',(req,res)=>{
    res.send("pong");
});

app.listen(PORT, ()=>{
    console.log(`server is running at PORT: ${PORT}`)
})
connectDB();