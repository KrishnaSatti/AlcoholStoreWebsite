import { NextApiRequest, NextApiResponse } from "next";
const { MongoClient, ServerApiVersion } = require("mongodb");
const bcrypt = require("bcryptjs");
import { verify } from "jsonwebtoken";
import { serialize } from "cookie";
const secret = "jsdlkgakl;jjdkl;fa";

export default async function (req, res) {
  const { cookies } = req;
  const jwt = cookies.OursiteJWT;

  if (!jwt) {
    return res.json({ message: "invalid token" });
  } else {
    console.log(cookies.OursiteJWT);
    const decoded = verify(cookies.OursiteJWT, secret);

    return res.json(decoded);
  }
}
