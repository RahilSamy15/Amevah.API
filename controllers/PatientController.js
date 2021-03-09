const User = require('../models/user');
const {validationResult}= require('express-validator/check');
const bcrypt= require('bcryptjs');
const { Error } = require('mongoose');
const user = require('../models/user');

exports.signUp = (req,res,next)=>{

    const errors= validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Error in validation');
        error.statusCode=422;
        error.data = errors.array()
        throw error
    }
    if(req.typeAccount !== "Medecin"){
        const error = new Error("Not Authorized");
        error.statusCode=401; 
        throw error
    }
    const email = req.body.email;
    const password= req.body.password;
    const fullname= req.body.fullname;
    console.log("it hited it ")
    User.findOne({ email: email }).then(res => {
        if (res) {

            return false;
        }
        return true

    }).then(notExist => {
        if (notExist) {
            bcrypt.hash(password, 12).then(
                hashPwd => {
                    const user = new User({
                        email: email,
                        password: hashPwd,
                        fullname: fullname,
                        type: 'Patient'
                    });
                    return user.save();
                }
            ).then(
                result => {
                    res.status(201).json({
                        message: 'User Created',
                        userId: result._id
                    })
                }
            ).catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
        } else {
            const error = new Error('User already exist');
            error.statusCode = 409;

            throw error
        }
    }).catch(err=>{
            
            err.statusCode= 409;
            next(err);
        });



};
exports.getAllPatient =(req,res,next)=>{
    const currentPage= req.params.page || 1; 
    const perPage=8; 
    let totalItems; 
    if(req.typeAccount !== "Medecin"){
        const error = new Error("Not Authorized");
        error.statusCode=401; 
        throw error
    }
    User.find({type:'Patient'}).countDocuments().then(count=>{
        totalItems = count;
        return User.find({type:'Patient'}).skip((currentPage-1)*2).limit(perPage);
    })
    .then(users => {
        res.status(200).json({
            patients: users, 
            totalItems:totalItems 
        }

        )})
    .catch(err=>{
        console.log("dis is ",err);
        err.statusCode= 409;
        next(err);
    });
    

}
exports.getPatient = (req,res,next)=>{
    const patientId= req.params.patientId;
    if(!(req.typeAccount=='Medecin' || req.userId == patientId)){
        const error = new Error("Vous n'êtes pas autorisé à faire cette action");
        error.statusCode= 401; 
        throw error
    }
    User.findOne({_id:patientId}).
    then(
        user=>{
            if(!user){
                const error = new Error("Utilisateur introuvable ");
                error.statusCode= 404;
                throw error;
            }
            res.status(200).json({
                patient:user
            })
        }
    ).
    catch(
        err=> {
            if(!err.statusCode){
                err.statusCode=500;
            }
            next(err);
        }
    );
};


exports.updatePatientData =(req,res,next)=>{
    if(req.typeAccount !== "Medecin"){
        const error = new Error("Not Authorized");
        error.statusCode=401; 
        throw error
    }
    const patientId= req.params.patientId;
    console.log(patientId);
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Error in validation');
        error.statusCode=422;
        error.data = errors.array()
        throw error
    }
    console.log("it hited");
    const fullname= req.body.fullname;
    const dateofbirth= req.body.dateofbirth;
    const age= req.body.age;
    const sexe= req.body.sexe;
    const smooker= req.body.smooker;
    User.findOne({_id:patientId}).
    then(user => {
        if(!user){
            const error = new Error('Patient does not exist');
            error.statusCode = 404;
            throw error
        }
        user.fullname= fullname;
        user.dateofbirth= dateofbirth;
        user.age= age;
        user.sexe= sexe;
        user.smooker= smooker;
        console.log(user);
        return user.save();
    }).then(result=>{
        res.status(200).json({
            message:"les données du patient ont été modifiées"
            
        })
    }).
    catch(err=> {
        if(!err.statusCode){
            err.statusCode=500;
        }
        next(err);
    });


};



exports.modifyCredPatient= (req,res,next)=>{
    if(req.typeAccount !== "Medecin"){
        const error = new Error("Not Authorized");
        error.statusCode=401; 
        throw error
    }
    const patientId= req.params.patientId;
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Error in validation');
        error.statusCode=422;
        error.data = errors.array()
        throw error
    }

    const email=req.body.email; 
    const password=req.body.password; 
    User.findOne({ _id: patientId }).then(
        user => {
            if (user) {
                bcrypt.hash(password, 12).then(pwdhash => {
                    user.email = email;
                    user.password = pwdhash;
                    return user.save()
                }).then(user => {
                    res.status(200).json({ message: "les logins du patient ont été modifiées" });
                }).catch(err => {
                    const error = new Error("Couldn't alter Patient logs");
                    error.statusCode = 500;
                    throw error
                });
            }
            else{
                const error = new Error("User doesn't exist");
                error.statusCode = 444;
                throw error
            }
        }
    ).catch(err=> {
        if(!err.statusCode){
            err.statusCode=500;
        }
        next(err);
    });


}

exports.searchPatientByEmail=(req,res,next)=>{
    const email=req.body.email;
    if(req.typeAccount=='Medecin'){
        User.findOne({email:email}).then(result=>{
            res.status(200).json({
                message:"Utilisateur trouve", 
                user:result
            });
        }).catch(err=>{
                
            err.statusCode= 409;
            next(err);
        });
    }
    
}


