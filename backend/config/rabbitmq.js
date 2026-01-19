const amqp = require('amqplib');

let channel;
let connection;

const connectRabbitMQ = async () => {
    let retries = 5;
    while (retries) {
        try {
            const amqpServer = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
            connection = await amqp.connect(amqpServer);
            channel = await connection.createChannel();
            await channel.assertQueue('email_queue');
            console.log('RabbitMQ Connected');
            return channel;
        } catch (error) {
            console.error(`RabbitMQ Connection Error (Retries left: ${retries}):`, error.message);
            retries -= 1;
            await new Promise(res => setTimeout(res, 3000)); // Wait 3 seconds
        }
    }
    console.error('RabbitMQ Connection Failed after retries');
};

const getChannel = () => channel;

const publishToQueue = async (queue, data) => {
    if (!channel) await connectRabbitMQ();
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
};

module.exports = { connectRabbitMQ, getChannel, publishToQueue };
