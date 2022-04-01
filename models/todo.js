import mongoose from "mongoose";

const nestedData = new mongoose.Schema({
    data : String ,
})

const TodoSchema = new mongoose.Schema({
    record : {type : String, required: true},
    date : {type : Number, default : 100},
    obj : nestedData,
})

//a valid todo 
// {
//     record : "asdfd"
//     date : dfdfd
//     obj :{
//         data : "343sdf"
//     }

// }

export const TodoModel = mongoose.model('TodoModel',TodoSchema)