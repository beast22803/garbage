const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.listen("3000",console.log("Server is running at port 3000"));

mongoose.connect("mongodb://localhost:27017/cqDB");

const contriSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: String,
    password: String
    // clg: String,
    // desg: String,
    // expt: String
});

const questSchema = new mongoose.Schema({
    subject: String,
    question: String,
    type: String,
    options: Array,
    user: contriSchema
});

const Contributor = new mongoose.model("contribute",contriSchema);

const Questions = new mongoose.model("question",questSchema);

let name="Login", condition=false, id=null, toq="";

app.get("/signup",function(req,res){
    res.render("signup",{Message: ""});
});

app.post("/signup",function(req,res){
    console.log(req.body);
    if(req.body.pwd === req.body.pwd2){
        const teach=new Contributor({
            firstName: req.body.fn,
            lastName: req.body.ln,
            email: req.body.email,
            phoneNumber: req.body.pn,
            password: req.body.pwd
        });
        teach.save();
        res.redirect("login");
    } else{
        res.render("signup", { Message: "Plz check the password" });
    }
});

app.get("/login",function(req,res){
    res.render("login",{Message: ""});
});

app.post("/login",function(req,res){
    console.log(req.body);
    Contributor.findOne({email: req.body.email},function(err,result){
        if(err){
            console.log("Not Existing");
        } else{
            if(result.password === req.body.pass){
                console.log("Correct");
                name="Hi, "+result.firstName;
                condition=true;
                id=result;
                res.redirect("/");
            } else{
                console.log("Not Correct");
                console.log(result);
                res.render("login", { Message: "Wrong password" });
            }
        }
    });
});

app.get("/",function(req,res){
    res.render("home",{ Name: name ,Condition: condition, User: id});
});

app.get("/create",function(req,res){
    res.render("create",{ Name: name ,Condition: condition, User: id,TOQ: toq});
});

app.post("/create/type",function(req,res){
    toq=req.body.toq;
    console.log(req.body);
    res.redirect("/create");
});

app.post("/create",function(req,res){
    console.log(req.body);
    console.log(toq);
    const question = new Questions({
        subject: req.body.se,
        question: req.body.question,
        type: toq,
        options: [req.body.opt1,req.body.opt2,req.body.opt3,req.body.opt4],
        user: id
    });
    question.save();
});