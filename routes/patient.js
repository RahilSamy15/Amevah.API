const express= require('express');
const {body}= require('express-validator/check');
const router = express.Router();
const PatientControl= require('../controllers/PatientController');
const isAuth= require('../middleware/is-auth');

router.post('/addPatient', isAuth,
    [body('email').trim(),
    body('password').trim().isLength({ min: 6 }),
    body('fullname').not().isEmpty()
    ]
    , PatientControl.signUp);
router.put('/:patientId', isAuth, [
    body('fullname').not().isEmpty(),
    body('dateofbirth').not().isEmpty(),
    body('age').not().isEmpty(),
    body('sexe').not().isEmpty(),
    body('smooker').not().isEmpty(),


], PatientControl.updatePatientData);

router.put('/alterCredPatient/:patientId', isAuth,
    [body('email').trim(),
    body('password').trim().isLength({ min: 6 })
    ], PatientControl.modifyCredPatient);
router.get('/patientbyEmail',isAuth,[body('email').not().isEmpty()],PatientControl.searchPatientByEmail);
router.get('/:patientId',isAuth, PatientControl.getPatient);

router.get('/', isAuth, PatientControl.getAllPatient);





module.exports= router;