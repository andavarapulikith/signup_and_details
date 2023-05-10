const express=require('express');
const path = require('path');
const app=express();
const mongoose = require('mongoose');
const multer=require('multer');
const fs=require('fs');
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'pdfs');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g,'-') + '_' + file.originalname);
  }
});

app.use(
  multer({ storage: fileStorage }).single('file')
);
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
const user_model = require('./models/user.js');
const connectionparams={ useNewUrlParser: true };
mongoose.set('strictQuery',false);

//set up mongoose connection
mongoose.connect("mongodb://0.0.0.0:27017/kudose", connectionparams)
  .then(() => {
    console.info("connected to the db");
    app.listen(process.env.PORT || 5000, () => {
      console.log('app listening in port 3000')
    })
  })
  .catch((e) => { console.log(e) })
app.get('/',(req,res)=>{
    res.render('register');
})
app.post("/signup",(req,res)=>{
    let firstname = req.body.fname;
    let lastname = req.body.lastname;
    let email = req.body.email;
    let phno = req.body.phno;
    let pswd = req.body.pswd;
    let cnfpswd = req.body.cnfpswd;
    const { originalname, buffer, mimetype } = req.file;
    let resume=req.file;
    const user=new user_model({
        firstname:firstname,lastname:lastname,email:email,password:pswd,phone:phno,resume:{
            data: buffer,
            contentType: mimetype
          },filename:resume.filename
    })
    user.save().then(() =>{ console.log('Document saved');res.redirect('/details')}).catch((err) => console.error(err));

   
    
})
app.get('/details',(req,res)=>{
    user_model.find({}).then((users)=>{
        // console.log(users);
        res.render('alldetails',{data:users});
    })
})
app.get("/read-pdf",(req,res)=>{
    const id=req.query.id;
    // console.log(id);
    user_model.findById({_id:id}).then((user)=>{
        // console.log(user);
        paths="pdfs/"+user.filename;
        if (fs.existsSync(paths)) {
            // Set the appropriate headers
            // console.log('hello');
            res.setHeader('Content-Disposition', 'attachment;inline;filename=file.pdf');
            res.setHeader('Content-Type', 'application/pdf');
        
            // Create a read stream from the file
            const fileStream = fs.createReadStream(paths);
        
            // Pipe the stream to the response object
            fileStream.pipe(res);
          
          } else {
            res.status(404).send('File not found');
          }
        
    }).catch((err)=>{console.log(err)});
})