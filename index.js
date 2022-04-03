import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import upload from "./utis/multer.js";
import cloudinary from "./utis/cloudinary.js"
import jwt from "jsonwebtoken"
// const cloudinary = require("./utis/cloudinary")

import {TodoModel} from './models/todo.js'
import {UserModel} from './models/user.js'

dotenv.config();

const app = express();

const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT || 3000;

// parse requests of content-type - application/json
app.use(express.json({limit : '50mb'}));
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({limit : '50mb', extended: true}));

app.get('/', (req, res) => res.json({ message: 'Hello World!' }))

app.post('/api/upload',  upload.single('image'),async(req, res) => {
    try{
        const uploadedResponse = await cloudinary.uploader.upload(req.file.path)
        res.json({ message: uploadedResponse })
    }catch(err){
        console.error(err);
        res.status(500).json({err: 'Something went wrong'})
    }
})

app.post('/api/create', async(req, res) => {
    const record = req.body
    console.log(record)
    const resp =await TodoModel.create(record)
    console.log(resp)
    res.json({status : 'cool'})
})

// app.listen(PORT, () => console.log(`Server is listening on port ${PORT}.`));
const JWT_SECRET = "asdlfjsf3402394pw[ia['03w-2343k;sdlfkg"
app.post('/api/change-pass',async(req, res) => {
    const {token,newPassword} = req.body
    try {
        const user =  jwt.verify(token,JWT_SECRET)
        console.log(user)
        const _id = user.id
        const hashedPassword = await bcrypt.hash(newPassword,10)
        await UserModel.updateOne({_id},{$set:{password:hashedPassword}})
        res.json({message: "cool"})
    }
    catch (err) {
        res.json({message: "Failed"})
    }
})
app.post('/api/login',async(req, res)=>{
    try
    {
        const {username, password} = req.body;
        const user = await UserModel.findOne({username}).lean()
        if(!user)return res.json({message : "Invalid"})
        console.log(user)
        if(await bcrypt.compare(password, user.password)){ // this compare the plainpassword that user sends with the hashed pass stored in db 
            const token = jwt.sign({
                id : user._id,
                username : user.username
            },JWT_SECRET)                   //creating a jwt token containing some data to be sent to client 
            res.json({message: "cool", token : token})
        }
        else throw new Error
    }
    catch(err) {
        res.json({message : "invalid"})
    }
})
app.post('/api/register',async(req, res)=>{
    const {username, password : plainPass} = req.body;
    const password = await bcrypt.hash(plainPass,10)
    try{
        const response = await UserModel.create({
            username : username,
            password : password
        })
        console.log(response)
        res.json({message: "cool"})
    }
    catch(e){
        console.log(e)
    }
})
mongoose
	.connect(CONNECTION_URL,{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() =>
		app.listen(PORT, () => console.log(`Server is running on ${PORT}`))
	)
	.catch((error) => console.log(`${error} did not connect `));

// mongoose.set("useFindAndModify", false);