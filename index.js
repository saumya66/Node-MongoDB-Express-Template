import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import upload from "./utis/multer.js";
import cloudinary from "./utis/cloudinary.js"
// const cloudinary = require("./utis/cloudinary")

import {TodoModel} from './models/todo.js'
console.log(TodoModel)
console.log(mongoose.model('TodoModel'))
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

// app.listen(PORT, () => console.log(`Server is listening on port ${PORT}.`));

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