import express, { request, response } from "express";
import { createConnection } from "./index.js";
import { auth } from "./auth.js";
import { ObjectId } from "mongodb";

const router= express.Router();

router.get("/adminPage", auth, async(request, response)=>{
  try {
    const client = await createConnection();
    const data=  await client
                .db("e-commerce-app")
                .collection("products")
                .find({})
                .toArray();
       
          response.send({statusCode:200, message:data})

  } catch (error) {
    console.log(error);
    response.send({message:error})
  }
})
router.put("/adminPage", auth, async(request, response)=>{
  try {
    
    const {quantity, data}= request.body;
    console.log(data);
    const client = await createConnection();
               await client
                .db("e-commerce-app")
                .collection("products")
                .updateOne({_id:ObjectId(data._id)},{$set:{quantity:+quantity}})// + is given to covert string to number
     const products= await client
                .db("e-commerce-app")
                .collection("products")
                .find({})
                .toArray()
          response.send({statusCode:200, message:"Changes Updated", products:products})

  } catch (error) {
    console.log(error);
    response.send({message:error})
  }
})

router.post("/adminPage", auth, async(request, response)=>{
  const {name, imageURL, price, currency, color, gender, quantity}= request.body;
   const client= await createConnection();
      const products= await client
                      .db("e-commerce-app")
                      .collection("products")
                      .find({})
                      .toArray()
          const id= products.length+1;
          await client
          .db("e-commerce-app")
          .collection("products")
          .insertOne({id, name, imageURL, price, currency, color, gender, quantity})
response.send({statusCode:200, message:"Product successfully added"})

})

router.delete("/adminPage", auth, async(request, response)=>{
  try {
    const {data}=request.body;
  const client= await createConnection();
                await client
                .db("e-commerce-app")
                .collection("products")
                .deleteOne({id:data.id})
   const products= await client
                  .db("e-commerce-app")
                  .collection("products")
                  .find({})
                  .toArray()

 response.send({statusCode:200, message:"Product removed successfully", products:products});
  } catch (error) {
    response.send({error:error})
  }
})

export const adminRouter=router;