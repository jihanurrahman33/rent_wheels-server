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

    const database = client.db("rent_wheels");
    const carsCollection = database.collection("cars");

    app.listen(port, () => {
      console.log(`app listening on port: ${port}`);
    });
  } finally {
  }
}
run().catch(console.dir);
