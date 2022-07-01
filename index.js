const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.55fmber.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
      await client.connect();
      const taskCollection = client.db("todo_list").collection("task");

      app.get('/task', async(req, res) => {
        const newTask = req.body;
        console.log('adding new task', newTask);
        const result = await taskCollection.insertAll(newTask);
        res.send(result);
      })

      // Get Tools
      app.get('/task', async (req, res) => {
        const query = {};
        const task = await taskCollection.find(query).toArray();
        res.send(task);
    })

    // Get Tools
    app.post('/task', async (req, res) => {
      const task = req.body;
      const result = await taskCollection.insertOne(task);
      res.send({ success: true });
  })



    }
    finally{

    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from todo World!");
});

app.listen(port, () => {
  console.log(`Todo app listening on port ${port}`);
});
