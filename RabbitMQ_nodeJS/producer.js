const amqplib = require("amqplib/callback_api");

amqplib.connect("amqp://localhost", (err, connection) => {
  if (err) throw err;

  // Sender
  connection.createChannel((err, channel) => {
    if (err) throw err;
    const queueName = "tasks";
    const message = "message from sender";

    channel.assertQueue(queueName, {
      durable: false,
    });
    channel.sendToQueue(queueName, Buffer.from(message));
    console.log(`message: ${message}`);
    setTimeout(() => {
      connection.close();
    }, 1000);
  });
});
