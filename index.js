import { createRequire } from "module";
import { MongoClient } from "mongodb";
const require = createRequire(import.meta.url);
import cors from "cors";
import { request } from "http";
import dotenv from "dotenv";
import { loginRouter } from "./loginPage.js";
import { signupRouter } from "./signupPage.js";
dotenv.config();
import { response } from "express";
import { forgotPasswordRouter } from "./forgot-password.js";
import { resetPasswordRouter } from "./reset-password.js";
import { productRouter } from "./products-routes/products.js";
import { wishlistRouter } from "./products-routes/wishlist.js";
import { adminRouter } from "./adminPage.js";

const express = require("express");
export const app = express();

//While putting in heroku give process.env.PORT || 5000   heroku will automatically assign it
const PORT = process.env.PORT || 6002;

// const MONGO_URL = "mongodb://localhost";
const MONGO_URL=process.env.MONGO_URL;
export async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("MongoDB connected");
  return client;
}

app.use(express.json());
app.use(cors());

app.get("/", (request, response) => {
  response.send("Hello world.....");
});

app.listen(PORT, () => {
  console.log("app is started with PORT " + PORT);
});

export const JWT_SECRET=process.env.JWT_SECRET;

app.use("/", loginRouter);
app.use("/", signupRouter);
app.use("/", forgotPasswordRouter);
app.use("/", resetPasswordRouter);
app.use("/", productRouter);
app.use("/", wishlistRouter);
app.use("/", adminRouter)



