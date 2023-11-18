const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require('./routes/auth')
const userRoute = require("./routes/user");

const cors = require("cors");

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DBConnection Successfull"))
  .catch((err) => {
    console.log(err);
  });
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.listen(5000,()=>{
    console.log("Backend sever is running !");
})