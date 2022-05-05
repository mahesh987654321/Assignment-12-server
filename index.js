const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
var jwt = require("jsonwebtoken");
var cors = require("cors");
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://laptop:RBfoLbF5tdAs03bt@cluster0.eotua.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "Unauthorized Access" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(
    token,
    `54dab75ad712812022813833f08092641f7650a9ef862d82817f40b857448f186a64524bf05a425d218e0b12724fd53f91545b84e2bf0cc0cc387cbf85914aeb`,
    (err, decoded) => {
      if (err) {
      }
      return res.status(403).send({ message: "Forbidden Access" });
    }
  );
  console.log("inside verifyHWT", authHeader);
  next();
}
client.connect((err) => {
  async function run() {
    try {
      await client.connect();
      const serviceCollection = client.db("laptop").collection("service");
      const myCollection = client.db("laptop").collection("order");
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
      app.post("/my", async (req, res) => {
        const my = req.body;
        const result = await myCollection.insertOne(my);
        res.send(result);
      });
      app.get("/my", verifyJWT, async (req, res) => {
        const authHeader = req.headers.authorization;
        console.log(authHeader);
        const email = req.query.email;
        const query = { email };
        const cursor = myCollection.find(query);
        const services = await cursor.toArray();
        res.send(services);
      });

      //AUTH
      app.post("/login", (req, res) => {
        const user = req.body;
        const accessToken = jwt.sign(
          user,
          `54dab75ad712812022813833f08092641f7650a9ef862d82817f40b857448f186a64524bf05a425d218e0b12724fd53f91545b84e2bf0cc0cc387cbf85914aeb`,
          {
            expiresIn: "1d",
          }
        );
        res.send({ accessToken });
      });
    } finally {
    }
  }
  run().catch(console.dir);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
<p>para graph</p>;
