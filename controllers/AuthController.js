const User = require('../models/user');
const {validationResult}= require('express-validator/check');
const bcrypt= require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signUp = (req,res,next)=>{

    const errors= validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Error in validation');
        error.statusCode=422; 
        error.data = errors.array()
        throw error
    }
    const email = req.body.email;
    const password= req.body.password; 
    const fullname= req.body.fullname;
    bcrypt.hash(password,12).then(
        hashPwd=>{
           const user= new User({
            email: email, 
            password:hashPwd, 
            fullname: fullname
           });
           return user.save();
        }
    ).then(
        result=>{
            res.status(201).json({
                message:'User Created', 
                userId: result._id
            })
        }
    ).catch(err=> {
        if(!err.statusCode){
            err.statusCode=500;
        }
        next(err);
    });
    
   
};

exports.login=(req,res,next)=>{
    const email= req.body.email; 
    const password= req.body.password; 
    let userLoad;

    User.findOne({email:email}).then(
        user=> {
            if(!user){
                const error = new Error("L'utilisateur est introuvable.");
                error.statusCode=401; 
                throw error;
            }
            userLoad=user; 
            return bcrypt.compare(password, user.password);

        }
    ).then(isEqual=>{
        if(!isEqual){
            const error = new Error('wrong password');
            error.statusCode=401; 
            throw error;
        }
        const token = jwt.sign({userId:userLoad._id.toString(),email:userLoad.email,type:userLoad.type},
        'V2Z1OV3NBrP0SCCsFP4TrSEkAyAUjvtcbQeWOWuy1Mpykuf2c99wLD+JSmU2IAWogHlspNUl6e5bZuy9r/gKSU8P1tmZnJaQXuzYfRBvdg7fvrYaq/Z1bqMykI7rR/r7UzZ1khvvunr+T2VM0OA1RuJIP1a5bjZde3Pe4H4TfQg='
        ,{expiresIn:'2h'}); 
        res.status(200).json({
            token:token, 
            userId:userLoad._id.toString()
        });

    }).catch(
        err=> {
            if(!err.statusCode){
                err.statusCode=500;
            }
            next(err);
        }
    );
    
}