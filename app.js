const express= require("express");
const bodyParser=require("body-parser");
const multer=require("multer");
const ejs= require("ejs");
const req = require("express/lib/request");
const mongoose=require("mongoose");
const fs=require("fs");
const path=require("path");
const connection=require("./database/connection");
const model=require("./database/model");

const app= express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));

app.set("view engine","ejs");
app.use(express.static("public"));

var storage = multer.diskStorage({  
    destination:(req,file,cb)=>{  
        cb(null,'./public/uploads');  
    },  
    filename:(req,file,cb)=>{  
        cb(null,file.originalname);  
    }  
});  
var upload = multer({storage:storage});

// var data;

app.get("/",function(req,res){
    model.find({},function(err,d){
        if(err)console.log("error in finding...");
        else{
            console.log(d.name);
            res.render("index",{img:d});
        }
    })
});

app.get("/download/:img",function(req,res){
    const file = `./public/uploads/${req.params.img}`;
    console.log(req.params.img);
    res.download(file);
});

app.post("/post",upload.single("uploaded_file"),function(req,res){
    var obj={
        name:req.file.filename,
        img:{
            data: fs.readFileSync(path.join(__dirname+"/public/uploads/"+req.file.filename)),
            contentType:'image/png'
        }
    }

    model.create(obj,function(err,item){
        if(err){
            console.log("error in creating");
        }else{
            res.redirect("/");
        }
    })

    // imgs.push(req.file.filename);
    // res.redirect("/");
});

let port=process.env.PORT;

if(port==null || port==""){
    port=3000;
}

app.listen(port);