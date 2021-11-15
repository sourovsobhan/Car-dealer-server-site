const express = require("express");
const app = express();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const { MongoClient } = require("mongodb");

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gdcqd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("Car_Dealer");
    const servicesCollection = database.collection("services");
    const usersCollection = database.collection("users");
    const orderCollection = database.collection("orders");
    const OrderCountCollection = database.collection("ordersCount");
    console.log("database connect successfully");

    // get api
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    // get api
    app.get("/orders", async (req, res) => {
      const cursor = orderCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders);
    });

    // GET Single Service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting specific service", id);
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.json(service);
    });
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      console.log("getting specific service", email);
      const query = { email: email };
      const service = await usersCollection.findOne(query);
      res.json(service);
    });

    // DELETE API
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log("hello", id);
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
    });

    // post api

    app.post("/services", async (req, res) => {
      const services = req.body;
      try {
        console.log("hit from services", services);
        console.log("hit the post api");
        res.send("post hitted");

        const result = await servicesCollection.insertOne(services);
        console.log(result);
        res.json(result);
      } catch (error) {
        console.log(error);
      }
    });
    // post api

    app.post("/orders", async (req, res) => {
      const orders = req.body;
      try {
        console.log("hit from orders", orders);
        console.log("hit the post api");
        res.send("post hitted");

        const result = await OrderCountCollection.insertOne(orders);
        console.log(result);
        res.json(result);
      } catch (error) {
        console.log(error);
      }
    });

    app.put("/users", async (req, res) => {
      const { email } = req.body;
      try {
        const filter = {
          $set: {
            role: "admin",
          },
        };
        const result = await usersCollection.updateOne(
          { email: email },
          filter
        );
        res.status(200).json(result);
      } catch (error) {
        console.log(error);
      }
    });

    app.post("/users", async (req, res) => {
      const services = req.body;
      try {
        console.log("hit from services", services);
        console.log("hit the post api");
        res.send("post hitted");

        const result = await usersCollection.insertOne(services);
        console.log(result);
        res.json(result);
      } catch (error) {
        console.log(error);
      }
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello dealer car!");
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
