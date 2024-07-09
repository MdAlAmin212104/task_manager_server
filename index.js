const express = require('express')
const cors = require('cors');
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000


// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.ythezyh.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();
    // Send a ping to confirm a successful connection
    //await client.db("admin").command({ ping: 1 });

    const userCollections = client.db("taskManager").collection("users");
    const taskCollections = client.db("taskManager").collection("task");

    app.post("/user", async (req, res) => {
        const user = req.body;
        const result = await userCollections.insertOne(user);
        res.send(result);
    });

    app.get('/users', async (req, res) => {
        const users = await userCollections.find().toArray();
        res.send(users);
    })

    app.post('/task', async (req, res) => {
        const task = req.body;
        const result = await taskCollections.insertOne(task);
        res.send(result);

    })

    app.get('/task', async (req, res) => {
        const email = req.query.email;
        let query = {};
        if (email) {
            query = { email : email };
        }
        const result = await taskCollections.find(query).toArray();
        res.send(result);
    })

    app.patch('/task/:id', async (req, res) => {
      const id = req.params.id;
      const { status } = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          status: status, 
        },
      };
      const result = await taskCollections.updateOne(filter, updateDoc);
      res.send(result);
    })


    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Task Manager server is running')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})