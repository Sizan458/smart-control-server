import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import jwt, { decode } from  'jsonwebtoken'

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
    const  AllAgreements= client.db("smart-build-control-server").collection("all-agreements")
    const  AllUser= client.db("smart-build-control-server").collection("all-user")
    const  AllAnnouncement= client.db("smart-build-control-server").collection("all-announcement")
//jwt related stuff
app.post("/jwt",async(req,res)=>{
  const  user = req.body
  const token=jwt.sign(user,process.env.ACCESS_TOKEN,{expiresIn:"36h"})
  res.send({token})
})
//middleware
const verifyToken = (req , res,next)=>{
  console.log('inside verify token', req.headers);
  if(!req.headers.authorization){
    return  res.status(401).send({message:"forbidden authorization"}) 
  }
  const token = req.headers.authorization.split(' ')[1]
  jwt.verify(token, process.env.ACCESS_TOKEN,(error, decode)=>{
  if (error){
    return res.status(401).send({message:"forbidden authorization"}) 
  }
  req.decode=decode
  })
 // next();
}

    //all apartments  databases
    //insert data into database
app .post ("/all-apartments", async(req, res) =>{
    const apartments = req.body;
    const result = await ALLApartment.insertOne(apartments);
    res.send(result);

})
//show all data in sever site
app.get("/all-apartments", async (req, res) => {
  //pagination
  const page= Number(req.query.page);
  const limit= Number(req.query.limit);
  //pagination logic
  const skip =(page-1)*limit
    const result = await ALLApartment.find().limit(limit).toArray();
    //count data
  const total = await ALLApartment.countDocuments()
    res.send({result,total});
  });
  //get data by id
  app.get("/all-apartments/:id",async(req, res) => {
    const id = req.params.id;
    const query = {
        _id: new ObjectId(id),
      };
     
    const result = await ALLApartment.findOne(query);
    res.send(result);
  })
  // agreements related  api
  // add data to database
  app .post ("/all-agreements", async(req, res) =>{
    const agreements = req.body;
    const result = await AllAgreements.insertOne(agreements);
    res.send(result);

})
//read all data
app.get("/all-agreements", async (req, res) => {
      const result = await AllAgreements.find().toArray();
      res.send(result);
    });

    //get data by id
  app.get("/all-agreements/:id",async(req, res) => {
    const id = req.params.id;
    const query = {
        _id: new ObjectId(id),
      };
     
    const result = await AllAgreements.findOne(query);
    res.send(result);
  })
  //delete api
  app.delete("/all-agreements/:id", async (req, res) => {
    const id = req.params.id;
    
    const query = {
      _id: new ObjectId(id),
    };
    const result = await AllAgreements.deleteOne(query);
   res.send(result);
  });
  // all user related  api
  // add data to database
  app .post ("/all-user", async(req, res) =>{
    const user= req.body;
    const query ={email:user.email}
    const existingUser = await AllUser.findOne(query);
    if(existingUser){
     return res.send({message:"User already exists",insertedId:null})
    }
    const result = await AllUser.insertOne(user);
    res.send(result);

})
//read all data
app.get("/all-user", verifyToken,  async (req, res) => {
     console.log(req.headers)
      const result = await AllUser.find().toArray();
      res.send(result);
    });

    //get data by id
  app.get("/all-user/:id",async(req, res) => {
    
    const id = req.params.id;
    const query = {
        _id: new ObjectId(id),
      };
     
    const result = await AllUser.findOne(query);
    res.send(result);
  })
  
  //delete  user
  app.delete("/all-user/:id", async (req, res) => {
    const id = req.params.id;
    
    const query = {
      _id: new ObjectId(id),
    };
    const result = await AllUser.deleteOne(query);
   res.send(result);
  });
//make admin
app.patch('/all-user/admin/:id',async(req, res)=>{
  const id= req.params.id;
  const filter={_id: new  ObjectId(id)}
  const  makeAdmin={
    $set:{
      role: 'admin',
    }
  }
  const result = await  AllUser .updateOne(filter, makeAdmin)
  
  
  res.send(result)
})
//make member
app.patch('/all-user/member/:id',async(req, res)=>{
  const id= req.params.id;
  const filter={_id: new  ObjectId(id)}
  const  makeMember={
    $set:{
      role: 'member',
    }
  }
  const result = await  AllUser .updateOne(filter, makeMember)
  
  
  res.send(result)
})

  // all announcement related  api
  // add data to database
  app .post ("/all-announcement", async(req, res) =>{
    const announcement= req.body;
    const result = await AllAnnouncement.insertOne(announcement);
    res.send(result);

})
//read all data
app.get("/all-announcement", async (req, res) => {
      const result = await AllAnnouncement.find().toArray();
      res.send(result);
    });

    //get data by id
  app.get("/all-announcement/:id",async(req, res) => {
    const id = req.params.id;
    const query = {
        _id: new ObjectId(id),
      };
     
    const result = await AllAnnouncement.findOne(query);
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