import express from "express";
import {auth} from "../auth.js";
import {createConnection} from "../index.js";



const router=express.Router();

router.get("/products", auth,  async(req, res)=>{
 try{
  const client=  await createConnection();
  const data=  await client
              .db("e-commerce-app")
              .collection("products")
              .find({})
              .toArray();
  
  res.send({statusCode:200 ,message:data});
 }catch(err){
   res.send({err:err})
 }
})
router.put("/products",auth,async(req, res)=>{
  try{
 
   const{data}=req.body;
   const client=await createConnection();

   await client
   .db("e-commerce-app")
   .collection("users")
   .updateOne({id:data.id},{$set:{quantity:data.quantity-1}});

   const products= await client
                  .db("e-commerce-app")
                  .collection("users")
                  .find({})
                  .toArray();
   res.send({statusCode:200, message:"Quantity reduced", products:products})
  }catch(err){
    res.send({err:err})
  }
})

export const productRouter= router;