const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user_schema = new Schema({
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    firstname: {
        type: String,
        required: [true, 'firstname is required']
    },
    lastname: {
        type: String,
        required: [true, 'lastname is required']
    },
    email: {
        type: String,
        required: [true, 'gmail is required']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required']
    },
    resume: {
        data: Buffer,
        contentType: String
      }
      ,filename:{
        type:String,
        required:[true,'filename required']
      }
    
});

const user_model = mongoose.model('user_model', user_schema);


module.exports = user_model;