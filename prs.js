const express1=require('express');
const router=express1.router();
const prs=require('../public/pr.js')

// router.get('/add_project',(req,res,next)=>{
//     res.reder('add_project');
// });
router.post('/addproject',(req,res)=>{
    const prname=req.body.pname
    const links=req.body.githublink
    const thumbnail=req.body.thumbnail

    const projectis=new prs({
        name:prname,
        links:githublink,
        thumbnail:thumbnail

    })
    projectis.save((err)=>{
        if(err){
            console.log("Fix Your code")
        }
        else{
           console.log("Project has been added")
           res.redirect('SignUp_success.html')
        }
    })

})