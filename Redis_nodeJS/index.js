const express = require("express");
const axios = require("axios");
const redis = require("redis");
const { promisify } = require("util");
const responseTime = require("response-time");
const app = express();

app.use(responseTime());

/* 
if redis is running any other port hear we need to mention the those  details inside a client
*/

const client = redis.createClient({
  host: "127.0.0.1",
  port: 6379,
});
(async () => {
  await client.connect();
})();
/* 
client is not comming with promice so we need to conver inside functions of  client by using promisify  module
*/
// const GET_ASYNC = promisify(client.get).bind(client);
// const SET_ASYNC = promisify(client.set).bind(client);

app.get("/rockets", async (req, res, next) => {
  try {
    // const replay = await GET_ASYNC("rockets");
    const replay = await client.get("rockets");
    await client.expire("rockets", 3);

    if (replay) {
      console.log("using cached data");
      res.send(replay);
      return;
    }
    const response = await axios.get("https://api.spacexdata.com/v3/rockets");

    await client.set("rockets", JSON.stringify(respone.data), "EX", 5);
    // const saveResult = await SET_ASYNC(
    //   "rockets",
    //   JSON.stringify(response.data),
    //   "EX",
    //   5
    // );

    console.log("new data cached", saveResult);
    res.send(response.data);
  } catch (error) {
    console.log(error);
  }
});

app.listen(4343, () => console.log("server runnig on 4343"));
