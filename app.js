const express = require('express');
const app = express();
const session = require('express-session');
const fs = require('fs');
const path =require('path');
var nodemailer = require('nodemailer');
const ejs = require('ejs')
const R =require('ramda');
app.use(express.urlencoded({extended:true}))
app.set('view engine', 'ejs');
app.use(session({
  secret: 'avi1229',
  resave: false,
  saveUninitialized: false
}));
const users=[{
    "Uname":"avi",
    "email":"avinashbirudugadda@gmail.com",
    "Pass": "1229"
},
{
    "Uname":"vishnu",
    "email":"vishnuvardhanreddy8980@gmail.com",
    "Pass": "1234"
}];

const admins=[{
    "Uname":"avinash",
    "email":"avinashbirudugadda@gmail.com",
    "Pass": "1229"
},
{
    "Uname":"krishna",
    "Pass": "1234"
},
{
    "Uname":"sai",
    "Pass": "2222"
}];

app.get('/', function(req, res) {
  res.render('index');
});


app.get('/adminlogin', function(req, res) {
    res.render('adminlogin',{errr:""});
});


app.get('/employeelogin', function(req, res) {
  res.render('employeelogin',{errr:""});
});

app.get('/trackleave', function(req, res) {
  res.render('leavetrack');
});

app.get('/applyleave', function(req, res) {
  res.render('request',{Uname:req.session.Uname,email:req.session.email});
});


app.get('/myleaves', function(req,res){
  res.render('myleaves',{Uname:req.session.Uname,email:req.session.email});
})
app.post('/adminauth', (req, res) =>{
    var flag=1;
    for( let i=0;i<admins.length;i++){
        if(admins[i].Uname===req.body.Uname && admins[i].Pass===req.body.Pass){
          req.session.Uname = req.body.Uname;
          req.session.email=admins[i].email;
          const data={name:req.session.Uname}
            res.render('admin',{data:data});
            flag=0;
            break
           
        }
    }
    if(flag){
        res.render('adminlogin',{errr:"Invalid Username or Password"});
        }

  });


  app.get('/reqs', (req, res) => {
    res.sendFile(path.join(__dirname, 'reqs.json'));
  });
  app.post('/reqs/:i/:st/', (req, res) => {
    var i=req.params['i']
    var st=req.params['st']
    console.log(req.params['i']);
    console.log(req.params['st']);
    fs.readFile('./reqs.json','utf8',function(err,data){
      
      if(err) throw err;
      var obj=JSON.parse(data);
      obj[i].status=st;
      obj=JSON.stringify(obj);
      fs.writeFile('./reqs.json',obj,function(err){
        if(err) throw err;
    });
    })

  });


  app.post('/employeeauth', (req, res) =>{
    var flag=1;
    for( let i=0;i<users.length;i++){
        if(users[i].Uname===req.body.Uname && users[i].Pass===req.body.Pass){
          req.session.Uname = req.body.Uname;
          req.session.email=users[i].email;
          const data = { name: req.body.Uname };
            res.render('employeehome',{data:data,email:req.session.email});
            flag=0;
            break
           
        }
    }
    if(flag){
        res.render('employeelogin',{errr:"Invalid Username or Password"});
        
        }

  }); 

  app.get('/script.js', (req, res) => {
    res.sendFile(__dirname + '/views/script.js');
  });

  app.post('/success',(req,res)=>{
    fs.readFile('./reqs.json','utf8',function(err,data){
      
        if(err) throw err;
        var obj=JSON.parse(data);
        var udata=req.body;
        var eto=req.body.email;
        udata.date=Date();
        const rn = Math.floor(Math.random() * 9000000000); + 1000000000;
        udata.trackid=rn;
        var rn1=udata.trackid;
        udata.status="Request Applied and Waiting for Approval ";
        var m="Your Request for Leave is applied Successfully .You can track your Request by using Tracking Id : "+rn1;
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'avinashbirudugadda@gmail.com',
            pass: 'muqhsmjahnzmmzxh'
          }
        });
        const mailOptions = {
          from: 'avinashbirudugadda@gmail.com',
          to: eto,
          subject: 'Application for Leave Request',
          text: m
        };
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
        setTimeout(() => {
          res.render('result');
          obj.push(udata);
        obj=JSON.stringify(obj);
        
          fs.writeFile('./reqs.json',obj,function(err){
              if(err) throw err;
          });
        
        },3000);

      

      });
    });
    app.get('/logout', (req, res) => {
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect('/');
        }
      });
    });

app.listen(3000, function() {
  console.log('Server listening on port 3000');
});