const express= require("express")
const bodyParser=require("body-parser")
const bcrypt=require("bcrypt")
require("dotenv").config()
const app=express()
app.use(bodyParser.urlencoded({extended:true}))
// allows server to accept the json object
app.use(express.json())
const PORT=process.env.PORT
const posts=[
    {
        username:"gaurav",
        post:"post1"
    },
    {
        username:"saurabh",
        post:"post2"
    }
]
const reg_user=[]
app.get("/posts",(req,res)=>{
    res.json(posts)
})
app.get("/users",(req,res)=>{
    res.send(reg_user);
})
// since bcrypt is asynchronous library
app.post("/users",async(req,res)=>{
    try{
        const hashed_pass= await bcrypt.hash(req.body.password,10);
        // console.log(salt);
        console.log(hashed_pass)
        const user={name:req.body.username,password:hashed_pass}
        reg_user.push(user)
        res.status(200).send("Signedup")
    }
    catch(error){
        console.log("err")
    }
})

app.post("/users/login",async(req,res)=>{
    const myuser=reg_user.find(user=>
        user.name=req.body.username
    )

    if(myuser==null){
        return res.status(401).send("User not exist")
    }

    try{
        const check= await bcrypt.compare(req.body.password,myuser.password)
        if(check){
            res.send("Successful login");
        }
        else{
            res.send("Wrong password");
        }
    }
    catch(err){
        console.log(err)
    }
})
app.listen(PORT,()=>{
    console.log("Server running on Port "+PORT)
})