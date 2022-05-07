const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
require("dotenv").config();
var cors = require("cors");
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.ADD_USER}:${process.env.ADD_PASSWORD}@cluster0.eotua.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

client.connect((err) => {
  async function run() {
    try {
      await client.connect();
      const serviceCollection = client.db("laptop").collection("service");
      const orderCollection = client.db("laptop").collection("order");

      app.get("/service", async (req, res) => {
        const query = {};
        const cursor = serviceCollection.find(query);
        const services = await cursor.toArray();
        res.send(services);
      });
      app.get("/service/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const service = await serviceCollection.findOne(query);
        res.send(service);
      });
      app.post("/service", async (req, res) => {
        const newService = req.body;
        const result = await serviceCollection.insertOne(newService);
        res.send(result);
      });
      app.put("/service/:id", async (req, res) => {
        const id = req.params.id;
        const updateUser = req.body;
        console.log(updateUser);
        const filter = { _id: ObjectId(id) };
        const options = { upset: true };
        const updateDoc = {
          $set: {
            quantity: updateUser.quantity,
          },
        };
        const result = await serviceCollection.updateOne(
          filter,
          updateDoc,
          options
        );
        res.send(result);
      });
      app.delete("/service/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await serviceCollection.deleteOne(query);
        res.send(result);
      });
      app.get("/order", async (req, res) => {
        const email = req.query.email;

        const query = { email };
        const cursor = orderCollection.find(query);
        const services = await cursor.toArray();
        res.send(services);
      });
      app.post("/order", async (req, res) => {
        const my = req.body;
        const result = await orderCollection.insertOne(my);
        res.send(result);
      });
      app.delete("/order/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await orderCollection.deleteOne(query);
        res.send(result);
      });

      //AUTH
    } finally {
    }
  }
  run().catch(console.dir);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
