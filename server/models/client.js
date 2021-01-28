const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//make schema that defines the structure
const clientSchema = new Schema({
    userId: {
        type: String,
        required:true
    },
    trainerId: {
        type: String
    },
    yearAdded:{
        type: String
    },
    username:{
        type: String
    },
    password:{
        type: String
    },
    profile:{
        type: String
    },
    status:{
        type: String
    },
    userProfile:{
        type: Object
    },

    programs: {
        type: Array
    },
    lessons: {
        type: Array
    },
    // notes:{
    //     type:Array
    // },
    notes:{
        type:String
    },
    photos:{
        type:Array
    } 
});


//export the model
module.exports = mongoose.model('Client', clientSchema, "Clients")