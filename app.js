const express= require('express');
const mongoose= require('mongoose');
const app= express();
const bodyparser = require('body-parser');
const UserRoutes= require('./routes/auth');
const PatientRoute= require('./routes/patient');
const ActivityRoute= require('./routes/activityRoute');
const helmet= require('helmet');
const compression= require('compression');
const MongoURI= `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.hsrgo.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`;
app.use(bodyparser.json());
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
    next();
});
app.use('/activity',ActivityRoute);
app.use('/patient',PatientRoute);
app.use('/auth',UserRoutes);
app.use(helmet());
app.use(compression());



app.use((error,req,res,next)=>{
    console.log(error); 
    const status = error.statusCode || 500; 
    const message= error.message; 
    const data= error.data; 

    res.status(status).json({
        message:message, 
        data:data
    })
});
mongoose.connect(MongoURI).then(res=>{
    app.listen(process.env.PORT|| 8080);
}).catch(err=> console.log(err));
