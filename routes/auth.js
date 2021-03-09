const express= require('express');
const {body}= require('express-validator/check');
const router = express.Router(); 
const userController = require('../controllers/AuthController');


router.post('/login',[
    body('email').not().isEmpty(),
    body('password').trim() 
],userController.login);
// Post/AddUser
router.post('/signUp',[
    body('email').isEmail().withMessage('Please enter a valid email.').normalizeEmail(),
    body('password').trim().isLength({min:6}), 
    body('username').not().isEmpty()
],userController.signUp);


module.exports= router;