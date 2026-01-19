require('dotenv').config();
const nodemailer = require('nodemailer');

const testEmail = async () => {
    console.log('Testing SMTP Configuration...');
    console.log('User:', process.env.SMTP_EMAIL);
    // Don't print the password for security, but check if it exists
    console.log('Password exists:', !!process.env.SMTP_PASSWORD);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_EMAIL,
            to: process.env.SMTP_EMAIL, // Send to self
            subject: 'Test Email from Bookstore App',
            text: 'If you receive this, SMTP is working correctly.',
        });
        console.log('Email sent successfully:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

testEmail();
