import { NextApiRequest, NextApiResponse } from "next";
const { MongoClient, ServerApiVersion } = require("mongodb");
const bcrypt = require("bcryptjs");

const uri =
  "mongodb+srv://admin:donisking@cluster0.w2jjljq.mongodb.net/?retryWrites=true&w=majority";
const saltRounds = 10;

async function monogoProducts(request) {
  const client = new MongoClient(uri);
  const checkPass = request.password;
  let data = {};
  try {
    const database = client.db("products");
    const collection = database.collection("food");
    const query = { username: request.username };
    const result = await collection.findOne(query);
    if (result != undefined) {
      bcrypt.compare(checkPass, result.password, function (error, isMatch) {
        if (error) {
          data = { message: false };
        } else if (!isMatch) {
          data = { message: false };
        } else {
          data = { message: true };
        }
      });
    } else {
      data = { message: false };
    }
  } finally {
    await client.close();
  }

  return data;
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const data = await monogoProducts(req.body);
  res.json(data);
}

//https://localhost:3000/api/createuser
