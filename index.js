const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express=require("express");
const path= require("path");
const methodOverride=require("method-override")
const app=express();
const port=8080;
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'instagram',
  password:'123456789'
});

app.listen(port,(req,res)=>{
        console.log(`request is recieved at this port : ${port}`);
});

// HOME ROUTE

app.get("/",(req,res)=>{
 let q=`SELECT COUNT(*) FROM user1`;
 try{
  connection.query(q,(err,result)=>{
  if(err) throw err;
  let count=result[0]["COUNT(*)"];
  // console.log(result[0]["COUNT(*)"]);
  res.render("home.ejs",{count});
  });

}catch(err){
    res.send("something went wrong");
}
  
});

//SHOW ROUTE
app.get("/users",(req,res)=>{
    let q=`SELECT * FROM user1`;
  connection.query(q,(err,users)=>{
    res.render("showUsers.ejs",{users});
  })
});


// EDIT ROUTE
 app.get("/user/:id/edit",(req,res)=>{

  let {id}=req.params;
  let q=`SELECT *FROM user1 WHERE id="${id}"`;
  try{
  connection.query(q,(err,result)=>{
  if(err) throw err;
  let user=result[0];
   res.render("edit.ejs",{user});
  });

}catch(err){
  console.log(err);
  }
});


// UPDATE ROUTE
app.patch("/user/:id",(req,res)=>{
let {id}=req.params;
let {username:newUser,password:formPass}=req.body;
let q=`SELECT *FROM user1 WHERE id="${id}"`;
 try{
  connection.query(q,(err,result)=>{
  if(err) throw err;
  let user=result[0];
  if(formPass!=user.password){
    res.render("passWarning.ejs",{formPass});
  }else{
    let q2=`UPDATE user1 SET username="${newUser}" WHERE id="${id}"`;
    connection.query(q2,(err,result)=>{
      if(err) throw err;
     res.redirect("/users");
    });
  }
});
}catch(err){
  console.log(err);
  res.send("some error in DB");
  }
});

// SERVING DELETE FORM 
app.get("/user/:id/delete",(req,res)=>{

  let {id}=req.params;
  let q=`SELECT *FROM user1 WHERE id="${id}"`;
  try{
  connection.query(q,(err,result)=>{
  if(err) throw err;
  let user=result[0];
     res.render("delete.ejs",{user});
  });

}catch(err){
  console.log(err);
  }
});


//  DELETE ROUTE
app.delete("/user/:id",(req,res)=>{
  let {id}=req.params;
let {password:formPass,email:formEmail}=req.body;
let q=`SELECT *FROM user1 WHERE id="${id}"`;
 try{
  connection.query(q,(err,result)=>{
  if(err) throw err;
  let user=result[0];
  if(formPass!=user.password || formEmail!=user.email){
    res.render("delWarning.ejs");
  }else{
    let q2=`DELETE FROM user1 WHERE id="${id}"`;
    connection.query(q2,(err,result)=>{
      if(err) throw err;
     res.redirect("/");
    });
  }
});
}catch(err){
  console.log(err);
  res.send("some error in DB");
  }
  
})

// SERVING ADD FORM
app.get("/user/add",(req,res)=>{
      res.render("add.ejs");
      
});

//   ADD ROUTE
 app.post("/user",(req,res)=>{
  let{id,username,email,password}=req.body;
  let adduser=[id,username,email,password];
  let q=`INSERT INTO user1 (id,username,email,password) VALUE (?,?,?,?)`;
  try{
  connection.query(q,adduser,(err,result)=>{
  if(err) throw err;
      res.redirect("/users");

    });

}catch(err){
  console.log(err);
  res.send("DB error");
    }
});

    








































// let data=[];

// let getRandomUser=()=> {
//     return [
//       faker.string.uuid(),
//       faker.internet.username(), // before version 9.1.0, use userName()
//       faker.internet.email(),
//       faker.internet.password(),
      
//     ];
//    }



// connection.end();



  