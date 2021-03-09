const mongoose = require('mongoose'); 
const Schema= mongoose.Schema; 

const activitySchema=  new Schema({
    NumberOfSteps:{
        type: Number, 
        required: true
    }, 
    Day: {
        type: Date, 
        required: true
    }, 
    UserId: {
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    }
}); 

module.exports = mongoose.model('Activity', activitySchema);