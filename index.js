const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
var cors = require("cors");
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const uri = `mongodb+srv://laptop:J1Yv0AfzWviyULby@cluster0.eqxbe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const databaseCollection = client.db("laptop").collection("service");
    app.get("/service", async (req, res) => {
      const q = req.query;
      const cursor = databaseCollection.find(q);
      const result = await cursor.toArray();
      res.send(result);
    });
    
  } finally {
    
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
