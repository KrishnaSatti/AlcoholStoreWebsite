import { NextApiRequest, NextApiResponse } from "next";
const { MongoClient, ServerApiVersion } = require("mongodb");
const bcrypt = require("bcryptjs");

const uri =
  "mongodb+srv://admin:donisking@cluster0.w2jjljq.mongodb.net/?retryWrites=true&w=majority";
const saltRounds = 10;

async function monogoProducts(request) {
  const password = request.password;
  let hashedpass = "";
  bcrypt.genSalt(saltRounds, function (saltError, salt) {
    if (saltError) {
      throw saltError;
    } else {
      bcrypt.hash(password, salt, function (hashError, hash) {
        if (hashError) {
          throw hashError;
        } else {
          console.log(hash);
          //$2a$10$FEBywZh8u9M0Cec/0mWep.1kXrwKeiWDba6tdKvDfEBjyePJnDT7K
          hashedpass = hash;
        }
      });
    }
  });

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
        password: hashedpass,
        name: request.name,
      };
      //const status = await collection.insertOne(doc);
      data = { acknowledged: true, insertedId: "null", password: hashedpass };
    }
  } finally {
    await client.close();
  }

  return data;
}

export default async function (req, res) {
  console.log(req.body.username);
  const data = await monogoProducts(req.body);
  res.json(data);
}

//https://localhost:3000/api/createuser
