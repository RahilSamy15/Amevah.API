const jwt= require('jsonwebtoken')
module.exports=(req,res,next)=>{
    const authHeader= req.get('Authorization');
    if(!authHeader){
        const error = new Error("vous n'etes pas authentifier");
        error.statusCode=401; 
        throw error;
    }
    const token = authHeader.split(' ')[1];

    try{
        decodedToken= jwt.verify(token,
        'V2Z1OV3NBrP0SCCsFP4TrSEkAyAUjvtcbQeWOWuy1Mpykuf2c99wLD+JSmU2IAWogHlspNUl6e5bZuy9r/gKSU8P1tmZnJaQXuzYfRBvdg7fvrYaq/Z1bqMykI7rR/r7UzZ1khvvunr+T2VM0OA1RuJIP1a5bjZde3Pe4H4TfQg=');
    }catch(err){
        err.statusCode=500; 
        throw err;

    }
    if(!decodedToken){
        const error = new Error("vous n'etes pas authentifier"); 
        error.statusCode= 401;
        throw error;
    }
    req.userId= decodedToken.userId; 
    req.typeAccount= decodedToken.type;
    next();


}