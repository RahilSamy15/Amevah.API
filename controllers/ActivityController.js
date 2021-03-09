const user = require('../models/user');
const activity = require('../models/Activity');

exports.PushActivity = (req, res, next) => {
    const nbPas = req.body.nombrePas;
    const Dayy = new Date();
    console.log(Dayy);
    const userId = req.userId;
    const Activity = new activity({
        NumberOfSteps: nbPas,
        Day: Dayy,
        UserId: userId
    });

    Activity.save().then(result => {
        return user.findById(userId)
    }

    ).then(user => {
        if (user) {
            user.activities.push(Activity);
            return user.save();
        }
    }).then(
        result => {
            res.status(201).json({
                message: "Activity have been added",
                user: result.activities
            });
        }
    ).catch(err=>{
        if(!err.statusCode){
            err.statusCode=500;
        }
        next(err);
    })

}
exports.getActivitiesOfPatient= (req,res,next)=>{
    if(req.typeAccount=='Medecin' || req.params.patientId == req.userId){
        activity.find({UserId:req.params.patientId}).then(result=>{
            res.status(200).json({activities:result});
        }).catch(err=>{
            if(!err.statusCode){
                err.statusCode=500;
            }
            next(err);
        }); 
    }else{
        const error = new Error("Vous n'etes pas autoriser a faire cette action"); 
        error.statusCode=401; 
        throw error
    }

    
    
    
}