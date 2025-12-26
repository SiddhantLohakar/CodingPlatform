const User = require("../models/user");
const validate = require("../utils/validate")
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const  sendVerificationEmail = require("../utils/sendEmail") 
const validateLogin = require('../utils/validateLogin')


async function register(req, res)
{
    try{
        const data = validate(req.body);
        
        if(Number.isNaN(data.age))
        {
           delete data.age
        }
    
        const isExisting = await User.findOne({email: data.email});
        if(isExisting)
            throw new Error("Email already registered");
    
        data.password = await bcrypt.hash(data.password, 10);
        const user =  await User.create(data);
        const token = jwt.sign({email: user.email, _id : user._id}, process.env.JWT_SECRET, {expiresIn: "24h"});

        await sendVerificationEmail(user.email, token);

        res.status(201).send("User registration successfull, Check your email for verification");


    }
    catch(err)
    {
        res.status(400).send("Error: "+ err.message);
    }
}



async function verifyEmail(req, res)
{
    console.log("Email Verification")
    try{
        const token = req.query.token;
        if(!token)
            throw new Error("Token not found");
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const _id = payload._id;

        const user = await User.findById(_id);
        if(!user)
            throw new Error("the user doesn't exist");

        if (user.isEmailVerified) {
            return res.send(`
                <h1 style="text-align: center; color: green; margin-top: 50px;">
                    Email Already Verified!
                </h1>
                <p style="text-align: center;">
                    Your email is already verified. You can <a href="/login">login</a>.
                </p>
            `);
        }

            await User.updateOne({_id: user._id}, {isEmailVerified: true});

         res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Email Verified</title>
                <style>
                    body {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        font-family: Arial, sans-serif;
                    }
                    .container {
                        text-align: center;
                        padding: 40px;
                        border: 2px solid green;
                        border-radius: 10px;
                    }
                    .success {
                        color: green;
                        font-size: 24px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1 class="success">✅ Email Verified Successfully!</h1>
                    <p>Your email <strong>${user.email}</strong> has been verified.</p>
                    <p>You can now <a href="/login">login</a> to your account.</p>
                </div>
            </body>
            </html>
        `);
    }
    catch(err)
    {
        if(err.message == "jwt expired")
            res.status(400).send(`<h1 style="display:flex; justify-content:center; align-items:center; width:100vw">Your token has been expired</h1>`)
        else
            res.status(400).send(`<h1 style="display:flex; justify-content:center; align-items:center; width:100vw">Error : ${err.message}</h1>`)
    }
}


async function login(req, res)
{   try
    {
          // Get the data 
        const data = req.body;

        const sanitizedData = validateLogin(data);

        const user = await User.findOne({email: sanitizedData.email});
        if(!user)
        {
           throw new Error("Invalid credentials"); 
        }

        const isValid = await bcrypt.compare(sanitizedData.password, user.password);
        if(!isValid)
            throw new Error("Invalid credentials");

        // Generate the token
        const token = jwt.sign({email: user.email, _id: user._id}, process.env.JWT_SECRET, {expiresIn: "24h"});
        
        if(!user.isEmailVerified)
        {
            await sendVerificationEmail(user.email, token)
            res.status(200).send("Please check your email for verification")
        }
        else
        {
            res.cookie("token", token, {expires: new Date(Date.now() + 24 * 60 * 60 * 1000)});
            res.status(200).json({message: "User Login successful"});
        }

    }
    catch(error)
    {
        res.status(401).json({message: "Invalid email or password"});
    }

}

module.exports = {register, verifyEmail, login};



