const nodemailer = require('nodemailer');


async function sendVerificationEmail(userEmail, token) {
    try {
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        
        const verificationLink = `${process.env.BASE_URL}/auth/verify-email?token=${token}`;
        
      
        const mailOptions = {
            from: `"${process.env.APP_NAME}" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: 'Verify Your Email',
            html: `
                <h1>Click the link to verify your email</h1>
                <a href="${verificationLink}">${verificationLink}</a>
            `
        };

        
        const info = await transporter.sendMail(mailOptions);
        
        console.log('Email sent to:', userEmail);
        return info;
        
    } catch (error) {
        console.error('Email error:', error.message);
        throw error;
    }
}

module.exports =  sendVerificationEmail ;