require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const admin = require("firebase-admin");
//middleware
app.use(cors());
app.use(express.json());
const { getAuth } = require("firebase-admin/auth");
const serviceAccount = require("./rentwheels-firebase-adminsdk.json");

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const database = client.db("rent_wheels");
    const carsCollection = database.collection("cars");

    app.listen(port, () => {
      console.log(`app listening on port: ${port}`);
    });
  } finally {
  }
}
run().catch(console.dir);
