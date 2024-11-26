const express=require('express')
const cors = require("cors");
const mongoose =require('mongoose')
const authRouter =require("./routers/auth")
const taskRouter = require("./routers/task");
// require('dotenv').config();
const app=express()
const port=5000;
app.use(cors());
app.use(express.json());


app.use("/auth",authRouter)
app.use("/task", taskRouter);



mongoose
  .connect(
    "mongodb+srv://nandinibure:tkur89jo9DxFMw8N@cluster0.a9pnq.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("mongodb connected"))
  .catch((err) => console.log(err));

app.listen(port,()=>
console.log("server runing"))


