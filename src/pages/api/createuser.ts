import { NextApiRequest, NextApiResponse } from "next";
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://admin:donisking@cluster0.w2jjljq.mongodb.net/?retryWrites=true&w=majority";

async function monogoProducts(request) {
  const client = new MongoClient(uri);
  let data = {};
  try {
    const database = client.db("products");
    const collection = database.collection("food");
    const query = { username: request.username };
    const result = await collection.findOne(query);
    if (result != undefined) {
      data = { acknowledged: false, insertedId: "null" };
    } else {
      const doc = {
        username: request.username,
        password: request.password,
        name: request.name,
      };
      const status = await collection.insertOne(doc);
      data = status;
    }
  } finally {
    await client.close();
  }

  return data;
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
  console.log(req.body.username);
  const data = await monogoProducts(req.body);
  res.json(data);
}

//yeah
//https://localhost:3000/api/createuser
