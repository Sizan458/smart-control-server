import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';

const app = express();
const port =process.env.PORT ||5001;
// middleware
app.use(cors());
app.use(express.json());
// connect to mongodb


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fo1holf.mongodb.net/?retryWrites=true&w=majority`;

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
    //create a new  database collection
    const ALLApartment=  client.db("smart-build-control-server").collection("all-apartments")
    //all apartments  databases
    //insert data into database
app .post ("/all-apartments", async(req, res) =>{
    const apartments = req.body;
    const result = await ALLApartment.insertOne(apartments);
    res.send(result);

})
//show all data in sever site
app.get("/all-apartments", async (req, res) => {
    const result = await ALLApartment.find().toArray();
    res.send(result);
  });
  //get data by id
  app.get("/all-apartments/:id",async(req, res) => {
    const id = req.params.id;
    const query = {
        _id: new ObjectId(id),
      };
      console.log(query);
    const result = await ALLApartment.findOne(query);
    res.send(result);
  })
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

//home page
app.get('/', (req, res) => {
    res.send("Welcome to  my server!");
})
// exceed the server
app.listen(port,()=>{console.log(`server is listening on ${port}`)}); 