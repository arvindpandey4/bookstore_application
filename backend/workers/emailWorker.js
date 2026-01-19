const nodemailer = require('nodemailer');
const { connectRabbitMQ } = require('../config/rabbitmq');

const sendEmail = async (to, subject, html) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: to,
        subject: subject,
        html: html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

const startEmailWorker = async () => {
    try {
        const channel = await connectRabbitMQ();
        if (!channel) return;

        console.log('Email Worker Started: Waiting for messages...');

        channel.consume('email_queue', async (data) => {
            if (data) {
                const message = JSON.parse(data.content.toString());
                console.log('Processing email job:', message.type);

                try {
                    if (message.type === 'RESET_PASSWORD') {
                        await sendEmail(
                            message.email,
                            'Reset Your Password - Bookstore',
                            `<h3>Password Reset Request</h3>
                             <p>Click the link below to reset your password:</p>
                             <a href="${message.link}">${message.link}</a>
                             <p>If you didn't request this, please ignore.</p>`
                        );
                    } else if (message.type === 'ORDER_CONFIRMATION') {
                        await sendEmail(
                            message.email,
                            'Order Placed Successfully - Bookstore',
                            `<h3>Order Confirmed!</h3>
                             <p>Thank you for your order.</p>
                             <p>Order ID: <b>${message.orderId}</b></p>
                             <p>You can track your order here: <a href="http://localhost:5173/orders">Track Order</a></p>`
                        );
                    }

                    channel.ack(data);
                } catch (err) {
                    console.error('Error processing message:', err);
                    // channel.nack(data); // Optionally retry
                }
            }
        });
    } catch (error) {
        console.error('Email Worker Error:', error);
    }
};

module.exports = startEmailWorker;
