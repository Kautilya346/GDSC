var express=require("express")
var bodyParser=require("body-parser")
const Collection=require("./mongodb")

//var morgan = require("morgan")
var cookieParser=require("cookie-parser")
const router=express.Router();
const prs=require('./pr')
const multer=require("multer")
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service:'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: 'gdsc8809@gmail.com',
      pass: 'apcymmqfnlnqeoyc'
    }   
  });

const app=express()
app.set('view engine', 'ejs');
app.set('views','views')

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(express.static("./public"));
app.use('/public/', express.static('./public'));


app.use(bodyParser.urlencoded({
    extended:true
}))

const storage = multer.diskStorage({
    destination: './public/my-uploads',
    filename:(req, file, cb)=> {
      cb(null, Date.now()+"-"+file.originalname)
    }
})
  
const upload = multer({ storage: storage })

app.use(cookieParser())

app.use(
    session({
        key:'user_sid',
        secret:'secretkeydontread',
        resave:false,
        saveUninitialized:false,
        cookie:{
            expires:600000
        }
    })
)

app.use((req,res,next) =>{
    if(req.session.user && req.cookies.user_sid){
        res.redirect('/dashboard')
    }
    next()
})

var sessionChecker = (req,res,next) => {
    if(req.session.user && req.cookies.user_sid){
        res.redirect('/SignUp_success.html')
    }
    else{
        next()
    }
}

// app.get('/',sessionChecker,(req,res) => {
//     res.redirect('/home.html')
// })

app.route("/sign_up")
.get(sessionChecker,(req,res) => {
    res.sendFile('fir.html')
})


app.post("/sign_up",async (req,res)=>{
    var name= req.body.name
    var email=req.body.email
    var password=req.body.password
    var cpassword=req.body.cpassword
    var mycap=req.body.mycap    
    let regex =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/; 
    

    if(!email.includes('@lnmiit.ac.in')){
        res.send('E-mail should have @lnmiit.ac.in')
    }
    else if(password!=cpassword){
        res.send('Passwords do not Match')
    }
    
    else if(!regex.test(password)){
        res.send('Password must contain one uppercase, one lowercase and a special character*')
    }
    else{
        var data={
            'name':name,
            'email':email,
            'password': password
        }
        try{
            await Collection.insertMany([data])
            console.log("Data has been inserted")
            const mailinfo ={
                from: '"AUTO GENERATED" <gdsc8809@gmail.com>',
                to: email,
                subject: `Hello, ${name}`,
                html: `
                <h3>Welcome to Project Manager</h3>
                <p>Link to to your Personal Dashboard: http://localhost:3000/SignUp_success</p>
                `
              };

              const sendMail= async(transporter,mailinfo)=>{
                try{
                    await transporter.sendMail(mailinfo)
                    console.log("E-mail has been sent")
                } catch (error){
                    console.log(error)
                }
              }
              sendMail(transporter,mailinfo)
            
            return res.redirect('SignUp_success.html')
        }
        catch(error){
            res.send('E-mail Already in Use')
        }    
    }
})


app.post("/log_in",async (req,res)=>{
    
    try{
        const check=await Collection.findOne({email:req.body.email})
        if(check.password===req.body.password){
            res.redirect('SignUp_success.html')
        }
        else{
            res.send("Wrong password")
        }
    }
    catch{
        res.send("Invalid E-Mail")
    }
})


app.post("/add_project",upload.single("thumbnail"),async (req,res)=>{
    var prname=req.body.pname
    var links=req.body.githublink
    const thumbnail=req.file.filename

    const projectis={
        'prname':prname,
        'githublink':links,
        'thumbnail':thumbnail

    }   
    await prs.insertMany([projectis])
    console.log("Project has been added")
    return res.redirect('SignUp_success.html')
  
})

app.get('/viewpr',(req,res)=>{
    prs.find({})
    .then((x)=>{
        res.render('../views/view_projects',{x})
    })
    .catch((y)=>{
        console.log(y)
    })
   
})

app.get('/edit/:id', async (req,res,next)=>{
    try{
        const tbU=await prs.findByIdAndDelete({_id:req.params.id})
        console.log('Edited Successfully')
        return res.redirect('../public/add_project.html')
    }
    catch(err){
        console.log(err)
    }
})

app.get('/delete/:id', async (req,res,next)=>{
    try{
        const tbd=await prs.findByIdAndDelete({_id:req.params.id})
        console.log('Deleted Successfully')
        res.redirect('back');
    }
    catch(err){
        console.log(err)
    }
    
})

app.get("/",(req,res)=>{
    res.set({
        "Allow-access-Allow-Origin": '*'
    })
    return res.redirect('home.html')
}).listen(3000);

console.log("ON 3000")

