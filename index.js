import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connection from "./Connection.js"
import { genPassword, createManager,checkuser } from "./helper.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


const app=express()

app.use(express.json({extended:false}));
app.use(cors());
dotenv.config();





const Port=process.env.Port


app.get('/',(req,res)=>{
    res.send("server is running");
})


app.post('/Login',async(req,res)=>{
  
  


    try {
        const client= await connection()

        const {email,password}=req.body;
        console.log(email,password);
    
        
        const result=  await client.db('users').collection('user2').findOne({email:email});
        console.log(result)
         




        const storedpass=result.password;
                if(!result){
                    res.status(403).json({message:"Wrong username or password"})

                }



        const isMatch= await bcrypt.compare(password,storedpass); 
     //   const user=client.db("users").collection("users2").find({email:email,password:password})
       //   console.log(user.data)
             if(isMatch){
                
            
                    const token=jwt.sign({id:result._id},process.env.SECRET_KEY) //jwt token
                    
                  
                    
                    res.status( 200).send({ message:"login sucessful",token:token,user:result});
                } 



        
    } catch (error) {
        console.log(error);
    }


});


app.post('/signup', async (req,res)=>{
    
    const client=await connection();
    
    const { email, name,password,dob,age,mobile,gender}=req.body;
    
    
    const hashpassword=  await genPassword(password);
    //console.log(username,password)
       
    
    const result= await createManager(client, name, hashpassword,email);
    console.log(result)

    //console.log(adduser,result); 
    res.send(result);


});



app.post('/edit/:email',async(req,res)=>{
    try{
      
 
     const client=await connection()
        const{email}=req.params;
        console.log(email)
 

     const {dob,age,mobile,gender}=req.body;


      const result= await client.db('users').collection('user2'). updateOne({email:email}, {$set :{dob:dob ,age:age,mobile:mobile,gender:gender}},{upsert:true})  
      console.log(result);
     
     res.status(200).send({message:"user edit success"})
    }
    
    catch(error){
      res.status(400).json(error);
    }



  

})



app.get('/data/:email',async(req,res)=>{

  try {
      const {email}=req.params;
            

     const client=await connection()
      
     const resp= await client.db('users').collection('user2').find({email:email}).toArray()
      console.log(resp);
      res.send(resp)
    
  } catch (error) {
    console.log(error)
    res.status(400).json({error})
    
  }

})

app.listen(Port,()=>{
    console.log("server running at ",Port)
})