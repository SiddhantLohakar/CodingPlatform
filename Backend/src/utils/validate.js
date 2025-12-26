const validator = require('validator')

const valiadate = (data)=>{
    
    const requiredField = ['firstName', "email", "password"];
    const isAllowed = requiredField.every((k)=> Object.keys(data).includes(k));

    if(!isAllowed)
        throw new Error("Some field is missing");

    const validLength = validator.isLength(data.firstName, {min: 2, max:20});
    if(!validLength)
        throw new Error("The first name length should be in the range of 2 and 20");
    
    data.email  = data.email.toLowerCase();

    const validEmail = validator.isEmail(data.email);

    if(!validEmail)
        throw new Error("Invalid email");

    const isStrongPassword = validator.isStrongPassword(data.password);

    if(!isStrongPassword)
        throw new Error("Password is not strong enough");

    if(data.lastName)
    {
        const validLastLength = validator.isLength(data.lastName, {min: 2, max:20});
        if(!validLastLength)
            throw new Error("The last name length should be in range of 2 and 20");
    }

    if(data.age)
    {
        const age = Number(data.age);
         if (isNaN(age) || age < 6 || age > 100) {
            throw new Error('Age must be 6-100');
        }
    }


    const newData = {
        firstName: validator.trim(data.firstName),
        lastName: data.lastName? validator.trim(data.lastName) : "",
        password: data.password,
        age: data.age? data.age: NaN,
        email: data.email
    }

    return newData;

}

module.exports = valiadate;