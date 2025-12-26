const validator = require("validator")


function validateLogin(data)
{
    
    // Validate if both email and password are present
    if(!data.email)
        throw new Error("Email is missing");
    if(!data.password)
        throw new Error("Password not present")

    // Chekck if the email is valid or not
    if(!validator.isEmail(data.email))
        throw new Error("Invalid email");

    // Sanitizing the input
    const sanitizedData = {
        email: validator.trim(data.email),
        password: data.password
    }

    return sanitizedData;
} 

module.exports = validateLogin