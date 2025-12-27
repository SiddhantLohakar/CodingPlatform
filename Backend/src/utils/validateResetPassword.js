const validator = require("validator");

function validateResetPassword(data)
{
   
     if(!data.oldPassword)
                throw new Error("Old password missing");
    
    if(!data.newPassword)
        throw new Error("New Password missing");

    if(!data.confirmPassword)
        throw new Error("Confirm Password missing");

    if(!validator.isStrongPassword(data.newPassword))
        throw new Error("Password must contain 1 lowercase, 1 uppercase, 1 special character, and minimum length must be 8");

    if(data.newPassword != data.confirmPassword)
        throw new Error("New password doesn't match confirm password");

    return true;
}

module.exports = validateResetPassword;