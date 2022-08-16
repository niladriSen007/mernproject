import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
const EmployeeSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        minlength:2,
    },
    lastname:{
        type:String,
        required:true,
        minlength:2,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validation(value){
            if(!validator.isEmail(value))
            {
                console.log("Invalid Email Address");
            }
        }
    },
    phone:{
        type:Number,
        required:true,
        unique:true,
        minlength:12,
        maxlength:14
    },
    gender:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        validation(value){
            if(!validator.isStrongPassword(value))
            {
                console.log("Invalid Password");
            }
        }
    },
    confirmpassword:{
        type:String,
        required:true,
        validation(value){
            if(!validator.isStrongPassword(value))
            {
                console.log("Invalid Password");
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})


EmployeeSchema.methods.generateAuthenticationToken = async function(){

    try{
        // console.log(this._id.toString());
        const token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        console.log(token);
        this.tokens = this.tokens.concat({token:token});
        console.log(this.tokens);
        // await this.save();
        return token;
        
    }catch(e){
        res.status(400).send(e);
        console.log(e)
    }
}


EmployeeSchema.pre("save",async function(next){
    if(this.isModified("password"))
    {
        // const hashedPass =await bcrypt.hash(this.password,10);
         this.password =await bcrypt.hash(this.password,10);
         this.confirmpassword = await bcrypt.hash(this.password,10);
    }
    next();
})


const EmployeeDetails = new mongoose.model("EmployeeRegistration",EmployeeSchema);

export { EmployeeDetails }  