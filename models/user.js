import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username : {type : String, required : true, unique: true},
    password : {type : String, required : true}
},{collection : "users"})

export const UserModel = mongoose.model('UserSchema', UserSchema)