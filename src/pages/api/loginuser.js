import { NextApiRequest, NextApiResponse } from "next";
const { MongoClient, ServerApiVersion } = require("mongodb");
const bcrypt = require("bcryptjs");
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";

const uri =
  "mongodb+srv://admin:donisking@cluster0.w2jjljq.mongodb.net/?retryWrites=true&w=majority";
const saltRounds = 10;
const secret = "jsdlkgakl;jjdkl;fa";

async function monogoProducts(request) {
  const client = new MongoClient(uri);
  const checkPass = request.password;
  let data = false;
  try {
    const database = client.db("products");
    const collection = database.collection("food");
    const query = { username: request.username };
    const result = await collection.findOne(query);
    if (result != undefined) {
      //ENCRYPT DATA
      bcrypt.compare(checkPass, result.password, function (error, isMatch) {
        if (error) {
          data = false;
        } else if (!isMatch) {
          data = false;
        } else {
          data = result.name;
        }
      });
    } else {
      data = false;
    }
  } finally {
    await client.close();
  }

  return data;
}

export default async function (req, res) {
  //CHECK IF USER EXISTS
  const data = await monogoProducts(req.body);
  //ASSIGN JWT TOKEN
  if (data != false) {
    const token = sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
        name: data,
      },
      secret
    );

    const serialised = serialize("OursiteJWT", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    res.setHeader("Set-Cookie", serialised);
    res.status(200).json({ message: "Success!" });
  } else {
    res.json({ message: "Invalid credentials!" });
  }
}

//https://localhost:3000/api/createuser
