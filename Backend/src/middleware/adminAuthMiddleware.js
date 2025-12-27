const jwt = require('jsonwebtoken');
const User = require("../models/user");
const redisClient = require('../config/redis');

async function adminAuth(req, res, next)
{  
    try{
            const token = req.cookies.token;
            console.log(token);

            if(!token)
                throw new Error("Token not present");

            const {_id: _id}  = jwt.decode(token);
           
            if(!_id)
                throw new Error("Invalid token");

            const user = await User.findById(_id);
            if(!user)
                throw new Error("Invalid user");

            const IsBlocked = await redisClient.exists(`token:${token}`);
            
            if(IsBlocked)
                throw new Error("Invalid Token");

            if(user.role != "admin")
                throw new Error("User is not an admin");

            req.result = user;
            
            next();
    }catch(error)
    {
        res.status(401).json({
            message: error.message
        })
    }
   

}

module.exports = adminAuth