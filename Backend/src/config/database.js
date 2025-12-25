const mongoose = require('mongoose')

async function main()
{       
        await mongoose.connect(process.env.DATABASE_URL + "CodingPlatform");
}

module.exports = main;
