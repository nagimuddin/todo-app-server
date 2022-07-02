const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.55fmber.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    console.log('connect to mongodb');
    const taskCollection = client.db("todo_list").collection("task");

    // Get Tools
    app.get("/task", async (req, res) => {
      const query = {};
      console.log(req.params);
      const task = await taskCollection.find(query).toArray();
      res.send(task);
    });

    // Get Task
    app.post("/task", async (req, res) => {
      const task = req.body;
      const result = await taskCollection.insertOne(task);
      res.send(result);
    });

    //delete Task
    app.delete("/task/:id", async (req, res) => {
      const id = req.params.id;
      const result = await taskCollection.deleteOne({ _id: ObjectId(id) });
      res.send({ success: true });
    });

    //single service
    app.get("/task/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: ObjectId(id) };
      const result = await taskCollection.findOne(query);
      res.send(result);
    });

    //update service
    app.put("/task/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: ObjectId(id) };
      const newTask = req.body;
      const { available } = newTask;
      const options = { upsert: true };
      const updateDoc = {
        $set: { available },
      };
      const result = await taskCollection.updateOne(query, updateDoc, options);
      res.send({ message: "updated" });
    });

  } 
  finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from todo World!");
});

app.listen(port, () => {
  console.log(`Todo app listening on port ${port}`);
});
