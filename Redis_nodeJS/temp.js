const { createClient } = require("redis");

// const client = createClient({ host: "127.0.0.1", port: 6379 });

// (async () => {
//   await client.connect();
// })();

// client.on("connect", () => console.log("::> Redis Client Connected"));
// client.on("error", (err) => console.log("<:: Redis Client Error", err));

const client = createClient();
client.on("error", (err) => console.log("Redis Client Error", err));
function start() {}
(async () => {
  await client.connect();
  await client.set("key", "value");
  const value = await client.get("key");
  console.log(value);
})();
(async () => {
  console.log("before start");

  await start();

  console.log("after start");
})();
