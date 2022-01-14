const express= require("express");
const bodyParser=require("body-parser");
const multer=require("multer");
const ejs= require("ejs");
const req = require("express/lib/request");
const connection=require("./database/connection");

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

var imgs=[];

// var data;

app.get("/",function(req,res){
    res.render("index",{img:imgs});
});

app.get("/download/:img",function(req,res){
    const file = `./public/uploads/${req.params.img}`;
    res.download(file);
});

app.get("/:name",function(req,res){
    res.render("image",{img:req.params.name});
});

app.post("/post",upload.single("uploaded_file"),function(req,res){
    imgs.push(req.file.filename);
    res.redirect("/");
});

let port=process.env.PORT;

if(port==null || port==""){
    port=3000;
}

app.listen(port);