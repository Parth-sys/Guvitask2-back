import bcrypt from 'bcrypt'

 async function genPassword(password){
    const salt=await bcrypt.genSalt(10);
    return await bcrypt.hash(password,salt);
}



async function createManager(client, name, hashpassword,email,dob,age,mobile,gender) {
     
    // const mail=await Client.db("users").collection("Manager").findOne(email)
       
return await client.db("users").collection("user2").insertOne({ name: name, password: hashpassword,email:email,dob:dob,age:age,mobile:mobile,gender:gender });
  
    
        
    }
  
  
   
    async function checkuser(client,email) {
     
        // const mail=await Client.db("users").collection("Manager").findOne(email)
                
         return await client.db('users').collection('user2').findOne({email:email});
        
            
        }




  


  export {checkuser,createManager,genPassword}  