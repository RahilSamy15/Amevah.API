const mongoose= require('mongoose');

const Schema = mongoose.Schema; 

const userSchema = new Schema({
    email: {
        type:String, 
        required:true
    },
    password: {
        type:String, 
        required:true
    },
    fullname: {
        type:String, 
        required:true
    },
    type: {
        type:String, 
        default:'Medecin'
    },
    dateofbirth:{
        type: Date, 
        default: new Date(),
    },
    sexe:{
        type:String, 
        default:'Male'
    },
    age: {
        type:Number, 
        default:18
    }, 
    smooker:{
        type: Boolean, 
        default: false
    },
    activities: [{
        type: Schema.Types.ObjectId, 
        ref: 'Activity', 
    } ]

});

module.exports= mongoose.model('User',userSchema);