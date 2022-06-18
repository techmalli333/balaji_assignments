const express = require("express");
var elasticsearch = require("elasticsearch");

const app = express();

const axios = require("axios");
const { json } = require("express");
const esUrl = "http://localhost:9200/";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var client = new elasticsearch.Client({
  hosts: ["localhost:9200"],
});

(async () => {
  await client.ping(
    {
      requestTimeout: 30000,
    },
    function (error) {
      if (error) {
        console.error(" Cannot connect to Elasticsearch.");
        console.error(error);
      } else {
        console.log("Connected to Elasticsearch was successful!");
      }
    }
  );
})();

app.post("/create-index", async (req, res) => {
  try {
    const checkIndexExist = () =>
      new Promise((resolve) => {
        axios
          .get(`${esUrl}${req.body.index}`)
          .then((_) => {
            resolve(true);
          })
          .catch(() => {
            resolve(false);
          });
      });

    const ifIndexExist = await checkIndexExist();
    if (!ifIndexExist) {
      const esResponse = await axios.put(`${esUrl}${req.body.index}`, {
        mappings: {
          properties: {
            name: {
              type: "text",
            },
            email: {
              type: "text",
              fields: {
                raw: {
                  type: "keyword",
                },
              },
            },
            country: {
              type: "text",
            },
            age: {
              type: "integer",
            },
            company: {
              type: "text",
            },
            jobRole: {
              type: "text",
            },
            description: {
              type: "text",
            },
            createdAt: {
              type: "date",
              fields: {
                raw: {
                  type: "keyword",
                },
              },
            },
          },
        },
      });
      res.json(esResponse.data);
    } else {
      res.json("Index exist already");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

app.post("/data", async (req, res) => {
  try {
    // const sampleData = require("./sample.json");
    const sampleData = require("./temp.json");

    const sampleDataLength = sampleData.length;
    // for (let idx = 0; idx &lt; sampleDataLength; idx++) {
    //   await axios.post(`${esUrl}${req.body.index}/_doc`, sampleData[idx]);
    // }
    for (let i = 0; i < sampleDataLength; i++) {
      await axios.post(`${esUrl}${req.body.index}/_doc`, sampleData[i]);
    }

    res.json("Bulk data inserted");
  } catch (error) {
    res.status(500).json(error);
  }
});

app.post("/update", async (req, res) => {
  console.log(req.body);
  client.update(req.body).then(
    function (resp) {
      res.json("Successful update! The response was: ", resp);
    },
    function (err) {
      console.trace(err.message);
      res.json(err);
    }
  );
  // (!error) res.json(`Successful data  updated for id ${res.body._id}`)

  // return res.json(`Successful data  updated for id ${res.body._id}`)

  // ).catch(error) {
  //   return res.json(error)
  // };
});

app.get("/data/:index", async (req, res) => {
  try {
    let response;
    const test = req.query.test;

    switch (test) {
      case "sorting":
        response = await axios.post(`${esUrl}${req.params.index}/_search`, {
          sort: {
            createdAt: "desc",
          },
        });
        break;

      case "matching":
        response = await axios.post(`${esUrl}${req.params.index}/_search`, {
          query: {
            match: {
              country: "samoa",
            },
          },
        });
        break;

      case "multi-matching":
        response = await axios.post(`${esUrl}${req.params.index}/_search`, {
          query: {
            bool: {
              must: [
                {
                  match: {
                    name: "Anastacio Stamm",
                  },
                },
                {
                  match: {
                    country: "Samoa",
                  },
                },
              ],
            },
          },
        });
        break;

      default:
        response = await axios.get(`${esUrl}${req.params.index}/_search`);
        break;
    }

    res.json(response.data);
  } catch (error) {
    res.json(error);
  }
});

app.delete("/data/:index/:id", async (req, res) => {
  try {
    const response = await axios.delete(
      `${esUrl}${req.params.index}/_doc/${req.params.id}`
    );
    res.json(response.data);
  } catch (error) {
    res.json(error);
  }
  res.json(`Deleted data ${req.params.id}`);
});

app.listen(3000, () => {
  console.log("App listening on port 3000!");
});
