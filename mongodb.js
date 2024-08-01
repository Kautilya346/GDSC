const mongoose=require("mongoose")

mongoose.connect("mongodb://localhost:27017/Signup")

.then(()=>{
    console.log("DataBase Connected")
})
.catch(()=>{
    console.log("Cannot Connect")
})

const signupSchema =new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }

})

const coll=new mongoose.model("Collection1",signupSchema)

module.exports=coll
