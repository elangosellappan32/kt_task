const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "your_database",
  password: "your_password",
  port: 5432
});

app.post( "/login" ,  async (req, res) => {
  const { email,password} =req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM app_user  WHERE email = $2 and password = $3"
     ,[email,password]
    );
    if (result.rows.length >0)
      {
      return res.json({sucess:true, message:"login successfully "})
      }
      else{ 
           return res.status(401).json({sucess:false, message:"login failed"});
      }
  }
    catch (err){
        console.error(err);
        return res.status(500).json({message:"internal server error"});
    }
});

app.listen(3333, () => console.log("Server running on port 3333"));