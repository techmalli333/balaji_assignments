const express = require("express");
const mongoose = require("mongoose");
const { ApolloServer } = require("apollo-server-express");
const resolvers = require("./resolvers");
const typeDefs = require("./typeDefs");
// gql is help to highliting sentax

async function startServer() {
  const app = express();
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app: app });
  app.use((req, res) => {
    res.send("Hellow from express apollo server");
  });

  await mongoose
    .connect(
      "mongodb+srv://lee:lee@cluster0.eydcg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    )
    .then(() => console.log("MongooseDB is connected"))
    .catch((err) => console.log(err));

  app.listen(4000, () => console.log("server is running at 4000"));
}

startServer();
