const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const indexRouter = require("./routes/index")
const cors = require('cors')
require("dotenv").config();

const app = express()
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json()); //req.body가 객체로 인식!

const mongoURI = process.env.LOCAL_DB_ADDRESS;

mongoose.connect(mongoURI).then(()=> console.log('mongoose connected'))
.catch((err)=> console.log("DB connection fail", err));

app.use("/api",indexRouter); // /api = /api 라는 주소로 호출이 오면 indexRouter로 가고 -> /user주소로 오면 userApi로 보내는 거!!!

app.listen(process.env.PORT || 5000, ()=> {
    console.log(`server is running on ${process.env.PORT}`);
}) 