const express = require('express');
const User = require('../models/User')
const fetchuser = require('../middleware/fetchuser')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = "somil$$agrawal$";

// ROUTER 1  create a user using "/api/auth/createuser" , no login required
router.post('/createuser',[
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5}),
] , async (req, res)=>{ 
    const  errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
     }
     // chech wether user are already exist with same email 
     try {
     let user =await User.findOne({ email: req.body.email });
     if (user) {
          return res.status(400).json({error : "Sorry this email address are already exist"})
          }
      const salt = await bcrypt.genSaltSync(10);
      const secpass = await bcrypt.hashSync(req.body.password, salt);
         user =  await User.create({
        name: req.body.name,
        password: secpass,
        email: req.body.email,
         })
          const data  = {
               user: {id : user.id}
          }
          const authtoken = jwt.sign( data,JWT_SECRET)
          res.json({authtoken})
     } catch (error) {
          console.error(error.message)
          res.status(500).send("some error occures")
}
     
})

// ROUTER 2 Authentication"/api/auth/login" 
router.post('/login',[
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password can not be blank ').exists()
], async (req, res) => {
     // if there is error , return bad request and error
      const  errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
     }
     const { email, password } = req.body;
     try {
          let user = await User.findOne({ email })
          if (!user){
          return res.status(400).json({ errors:"Please try to login your correct cerdentials" });
          }
          const passwordcompare = await bcrypt.compare(password, user.password)
          if (!passwordcompare) {
          return res.status(400).json({ errors:"Please try to login your correct cerdentials" });

     }
         
           const data  = {
                user: {
                     id: user.id
                }
          }
          const authtoken = jwt.sign(data, JWT_SECRET);
               res.json({ authtoken });
     } catch (error) {
     console.error(error.message)
     res.status(500).send("some error occures")  
     }
     
})
 
//ROUTER 3 get user login detail by user logged api/auth/getuser
router.post('/getuser',fetchuser ,  async (req, res) => {
     try {
            const userid = req.user.id   
          const user = await User.findById(userid).select('-password')
          res.send(user);
          
      } catch (error) {
           console.error(error.message)
     res.status(500).send("some error occures")  
      }
})


module.exports = router  