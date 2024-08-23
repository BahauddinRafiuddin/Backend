import 'dotenv/config'
import connectDb from "./db/index.js";
import app from "./app.js"


connectDb()
.then(()=>{
    app.listen(process.env.PORT||3000,(req,res) => {
      console.log(`Server Is Runnig On Port: ${process.env.PORT}`);
      
    })
})
.catch((error)=>{
    console.log("Mongo Db Connection Failed!!",error)
})