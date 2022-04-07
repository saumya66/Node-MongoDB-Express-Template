import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username : {type : String},
    name : {type : String, },
    image : {type : String},
    about : {type : String},
    email : {type : String, required : true,},
    password : {type : String, required : true}
},{collection : "users"})

const UserModel = mongoose.model('UserSchema', userSchema)

export default UserModel;