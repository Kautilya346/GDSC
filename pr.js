const mongoose=require("mongoose")

mongoose.connect("mongodb://localhost:27017/Signup")

.then(()=>{
    console.log("DataBase Connected Successfully")
})
.catch(()=>{
    console.log("Cannot Connect")
})

const prSchema =new mongoose.Schema({

    prname:{
        type:String,
        required:true
    },
    githublink:{
        type:String,
        required:true
    },
    thumbnail:{
        type:String,
        required:true
    }

});

module.exports=mongoose.model('Prdata',prSchema);
