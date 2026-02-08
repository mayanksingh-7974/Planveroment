const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const session = require("express-session");

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.use(session({
  secret:"plantsecret",
  resave:false,
  saveUninitialized:false
}));

/* ===== DATABASE ===== */

mongoose.connect("mongodb://127.0.0.1:27017/planveroment");

const User = mongoose.model("User",{
  name:String,
  email:String,
  password:String
});

const Contact = mongoose.model("Contact",{
  name:String,
  email:String,
  message:String
});

const Reminder = mongoose.model("Reminder",{
  user:String,
  plant:String,
  date:String
});

/* ===== AUTH ===== */

app.post("/api/signup", async(req,res)=>{
  const hash = await bcrypt.hash(req.body.password,10);
  await User.create({...req.body,password:hash});
  res.json({success:true});
});

app.post("/api/login", async(req,res)=>{
  const user = await User.findOne({email:req.body.email});
  if(!user) return res.json({success:false});

  const ok = await bcrypt.compare(req.body.password,user.password);

  if(ok){
    req.session.user=user.email;
    res.json({success:true});
  } else res.json({success:false});
});

/* ===== CONTACT ===== */

app.post("/api/contact", async(req,res)=>{
  await Contact.create(req.body);
  res.json({success:true});
});

/* ===== REMINDER ===== */

app.post("/api/reminder", async(req,res)=>{
  await Reminder.create(req.body);
  res.json({success:true});
});

app.get("/api/reminder", async(req,res)=>{
  res.json(await Reminder.find());
});

/* ===== ADMIN ===== */

app.get("/api/admin/messages", async(req,res)=>{
  res.json(await Contact.find());
});

app.get("/api/admin/users", async(req,res)=>{
  res.json(await User.find());
});

/* ===== START ===== */

app.listen(3000,()=>console.log("http://localhost:3000"));
