const express= require('express');
const {body}= require('express-validator/check');
const router = express.Router(); 
const ActivityControl= require('../controllers/ActivityController');
const isAuth= require('../middleware/is-auth');



router.post('/addActivity',isAuth,[
    body('nombrePas').not().isEmpty()
],ActivityControl.PushActivity);
router.get('/getActivities/:patientId',isAuth,ActivityControl.getActivitiesOfPatient);
module.exports= router;