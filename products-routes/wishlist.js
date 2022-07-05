import express from "express";
import { createConnection } from "../index.js";
import { auth } from "../auth.js";

const router= express.Router();

router.post("/wishlist", auth, async(req, res)=>{
  try{
    const{username, data}=req.body;

    const client= await createConnection();
                       await client
                        .db("e-commerce-app")
                        .collection("users")
                        .updateOne({username:username},{$push:{wishlist:data}});
                                     
     
                        const wishlist=await client
              .db("e-commerce-app")
              .collection("users")
              .find({username:username})
              .toArray();
  
              await client
                        .db("e-commerce-app")
                        .collection("users")
                        .updateOne({username:username},{$set:{[`wishlist.${wishlist[0].wishlist.length-1}.quantity`]:data.quantity-1}}) 
              await client
              .db("e-commerce-app")
              .collection("products")
              .updateOne({id:data.id},{$set:{quantity:data.quantity-1}});
           
              const products= await client
                             .db("e-commerce-app")
                             .collection("products")
                             .find({})
                             .toArray();

        res.status(200).send({data:wishlist[0].wishlist, message:"Added to Cart",products:products, statusCode:200})

  }catch(err){
    res.send({err:err})
  }
})

router.get("/wishlist", auth, async(req, res)=>{
  try{
     const{username}=req.headers;
     const client=await createConnection();
     const wishlist= await client
                    .db("e-commerce-app")
                    .collection("users")
                    .find({username:username})
                    .toArray();
       
        let isWishlistPresent=wishlist[0].hasOwnProperty("wishlist");

    //  if(wishlist[0].wishlist.length!==0){
    //   res.send({statusCode:400, message:wishlist[0].wishlist})
    //  }else {
    //   res.send({statusCode:200, message:"There is no items in the Cart"})
    //  }
     if(isWishlistPresent && wishlist[0].wishlist.length!==0){
      res.send({statusCode:400, message:wishlist[0].wishlist})
     }else{
      res.send({statusCode:200, message:"There is no items in the Cart"})
     }
    
      
  }catch(err){
    res.send({message:err})
  }
})
router.put("/wishlist", auth, async(request, response)=>{
  try{
    const {index, username}=request.headers;
    const {data}= request.body;
    console.log(data)
    const client= await createConnection();
     await client
    .db("e-commerce-app")
    .collection("users")
    .updateOne({ username: username },{$unset:{["wishlist."+ index]:1}});

     await client
    .db("e-commerce-app")
    .collection("users")
    .updateOne({ username: username },{$pull:{"wishlist":null}});
    
   const wishlistData=await client
              .db("e-commerce-app")
              .collection("users")
              .find({username:username})
              .toArray();
  
      await client
            .db("e-commerce-app")
            .collection("products")
            .updateOne({id:data.id},{$set:{quantity:data.quantity+1}});
       
   const products= await client
                  .db("e-commerce-app")
                  .collection("products")
                  .find({})
                  .toArray();      
    console.log(products[0])
    response.status(200).send({statusCode:200, message:wishlistData[0].wishlist,products:products});
  }catch(err){
    response.send(err)
    console.log(err);
  }
})
export const wishlistRouter= router;