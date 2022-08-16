import 'dotenv/config';
import express from "express"
import { connection } from "./database/connection.js";
import fs from "fs";
import exphbs  from 'express-handlebars';
const __dirname = path.resolve();
import path from "path"
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:false}))
const port = process.env.PORT||5000;
import {EmployeeDetails} from "./models/employees.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";


//with partials folder
app.engine('hbs', exphbs.engine({
    extname: 'hbs',
    defaultLayout: false,
    layoutsDir: "views/layouts/",
    partialsDir  : [
        //  path to your partials
        path.join(__dirname, '../MernBackend/templates/partials'),
]
}));
//to set the view engine 
app.set('view engine', '.hbs');
//giving the views path otherwise a error will occur of 'no such file in directory ../views/layout/main.hbs'
app.set('views', path.join(__dirname,"../MernBackend/templates/views"));



// const  static_path = path.join(__dirname,"../MernBackend/public")
// // console.log(static_path);
// app.use(express.static(static_path))

console.log(process.env.SECRET_KEY)

app.get("/",(req,res)=>{
    res.render('login');
})

app.get("/login",(req,res)=>{
    res.render("login");
})

app.get("/register",(req,res)=>{
    res.render("register");
})

app.post("/login",async(req,res)=>{
    try{
            const email = req.body.email;
            const password = req.body.password;
            // const isPasswordMatch =await bcrypt.hash(password,10);
            // console.log(`email ${email} and password ${pass}`)
            const emailData = await EmployeeDetails.findOne({email:email});
            // const passwordData = await  EmployeeDetails.findOne({password:pass});
            // console.log(hashedPassword);
           const isPasswordMatch = await bcrypt.compare(password,emailData.password);

           const token =await emailData.generateAuthenticationToken();
           console.log("In the app.js.login file = "+token);

            if(isPasswordMatch)
            {
                res.status(200).render("main");
                // console.log(emailData);
            }
            else
            {
                res.status(400).send("Invalid login details.")
            }
         
    }catch(e){
        res.status(400).send("Invalid login details.😥");
    }
})


app.post("/register",async(req,res)=>{
    try
    {
        // const {firstname,lastname,email,phone,gender,password,confirmpassword}=req.body; 
        const employee = new EmployeeDetails({
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            email:req.body.email,           
            phone:req.body.phone,
            gender:req.body.gender,
            password:req.body.password,
            confirmpassword:req.body.confirmpassword
        });
        // const user = req.body;
        // console.log(employee.firstname);
        const pass = employee.password;
        const confPass = employee.confirmpassword;
        const token =await employee.generateAuthenticationToken();
        console.log("In the app.js file = "+token);
        if(pass === confPass)
        {
            //before saving we will hash the password
            
            const userDetails = await employee.save();
            res.status(200).render("registrationSuccessful");
        }
        else
        {
                res.status(400).send("Please enter the same password.")
        }
        // console.log(user.confirmpassword);
       
        // res.status(200).send(firstname,lastname,email,phone,gender,password,confirmpassword);
       
    }
    catch(e)
    {
        res.status(400).send(e);
    }
})

//how to use bcrypt
// const securePassword =async(password) =>{
//     const hashedPass =await bcrypt.hash(password,10);
//     console.log(hashedPass)
//     const matchPass = await bcrypt.compare(password,hashedPass);
//     console.log(matchPass);
// }

// securePassword("niladri@123")

//json web token
//payload is the unique data
// const createToken = async()=>{
//     const token =await jwt.sign({_id:"62f9e8e4d97b29a1daab4982"},"mynameisniladrisenandiamafullstackdeveloper",{
//         expiresIn:"10 days"
//     });
//     console.log(token);

//     const userVerification = await jwt.verify(token,"mynameisniladrisenandiamafullstackdeveloper")
//     console.log(userVerification);
//     }

// createToken();




app.listen(port,()=>{
    console.log(`Server is running at port ${port}`);
})