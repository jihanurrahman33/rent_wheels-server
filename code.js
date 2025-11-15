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

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: missing Bearer token" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: token missing" });
    }

    const decodedToken = await getAuth()
      .verifyIdToken(token)
      .catch((err) => {
        console.error("verifyIdToken error:", err);
        throw err;
      });

    req.firebaseUser = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      claims: decodedToken,
    };

    return next();
  } catch (err) {
    console.error("Firebase verification failed:", err);

    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

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

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    const database = client.db("rent_wheels");
    const carsCollection = database.collection("cars");

    app.get("/", (req, res) => {
      res.send({ message: "Server is live" });
    });

    app.post("/add-car", verifyFirebaseToken, async (req, res) => {
      const data = req.body;
      const result = await carsCollection.insertOne(data);

      res.send(result);
    });
    app.get("/all-cars", async (req, res) => {
      const cursor = carsCollection.find();
      const data = await cursor.toArray();

      res.send(data);
    });
    app.get("/cars", async (req, res) => {
      const cursor = carsCollection.find().limit(6);
      const data = await cursor.toArray();

      res.send(data);
    });
    app.delete("/cars/:id", verifyFirebaseToken, async (req, res) => {
      const carId = req.params.id;
      const result = await carsCollection.deleteOne({
        _id: new ObjectId(carId),
      });

      res.send(result);
    });
    app.get("/car-details/:id", verifyFirebaseToken, async (req, res) => {
      const carId = req.params.id;
      const result = await carsCollection.findOne({ _id: new ObjectId(carId) });

      res.send(result);
    });

    app.patch("/book/", verifyFirebaseToken, async (req, res) => {
      try {
        const carId = req.query.id;
        const bookingEmail = req.firebaseUser.email;

        if (!carId) {
          return res.status(400).send({ message: "Car ID is required" });
        }

        const filter = { _id: new ObjectId(carId) };
        const updateDoc = {
          $set: {
            carStatus: "unavailable",
            bookedBy: bookingEmail,
          },
        };

        const result = await carsCollection.updateOne(filter, updateDoc);

        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error", error });
      }
    });
    app.patch("/removeBooking/", verifyFirebaseToken, async (req, res) => {
      try {
        const carId = req.query.id;
        const bookingEmail = req.firebaseUser.email;

        if (!carId) {
          return res.status(400).send({ message: "Car ID is required" });
        }

        const filter = { _id: new ObjectId(carId) };
        const updateDoc = {
          $set: {
            carStatus: "available",
            bookedBy: "none",
          },
        };

        const result = await carsCollection.updateOne(filter, updateDoc);

        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error", error });
      }
    });

    app.get("/my-bookings", verifyFirebaseToken, async (req, res) => {
      const realUserEmail = req.firebaseUser.email;
      const userEmail = req.query.email;
      if (realUserEmail !== userEmail) {
        res.status(401).send({ message: "forbidden access" });
      }

      const query = {
        bookedBy: userEmail,
      };
      const cursor = carsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/my-listing/", verifyFirebaseToken, async (req, res) => {
      try {
        const email = req.query.email;

        if (!email) {
          return res.status(400).json({ error: "Missing email query param" });
        }

        const cursor = carsCollection.find({ providerEmail: email });
        const data = await cursor.toArray();

        res.json(data);
      } catch (err) {
        console.error("Error in /my-listing:", err);
        res.status(500).json({ error: "Server error" });
      }
    });

    app.listen(port, () => {
      console.log(`app listening on port: ${port}`);
    });
  } finally {
  }
}
run().catch(console.dir);
