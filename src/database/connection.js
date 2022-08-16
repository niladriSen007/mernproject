import mongoose from "mongoose";

const connection = mongoose.connect("mongodb://localhost:27017/youtubeRegistration")
.then(()=>{
    console.log("Connection Successful");
}).catch((e)=>{
    console.log("No Connection");
})

export {  connection}