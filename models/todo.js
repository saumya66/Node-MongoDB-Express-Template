import mongoose from "mongoose";

const nestedData = new mongoose.Schema({
    data : String ,
})

const TodoSchema = new mongoose.Schema({
    record : {type : String, required: true},
    date : {type : Number, default : Date.now},
    obj : nestedData,
},{collection : "my-todos"})//name the collection here

//a valid todo 
// {
//     record : "asdfd"
//     date : dfdfd
//     obj :{
//         data : "343sdf"
//     }

// }

export const TodoModel = mongoose.model('TodoModel',TodoSchema)