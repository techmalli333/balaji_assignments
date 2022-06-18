const amqplib = require("amqplib/callback_api");
amqplib.connect("amqp://localhost", (err, connection) => {
  if (err) throw err;

  // Listener
  connection.createChannel((err, channel) => {
    if (err) throw err;
    const queueName = "tasks";

    channel.assertQueue(queueName, {
      durable: false,
    });

    channel.consume(queueName, (msg) => {
      if (msg !== null) {
        console.log(msg.content.toString());
        channel.ack(msg);
      } else {
        console.log("Consumer cancelled by server");
      }
    });
  });
});
