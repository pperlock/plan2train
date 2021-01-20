const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//make schema that defines the structure
const programSchema = new Schema({
    id: {
        type: String,
        required:true
    },
    trainerId: {
        type: String
    },

    name: {
        type: String
    },
    description: {
        type: String
    },
    resources:{
        type:Array
    }
});

//export the model
module.exports = mongoose.model('Program', programSchema, "Programs")