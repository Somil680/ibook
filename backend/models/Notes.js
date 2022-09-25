const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotesSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
        
    },
    tag: {
        type: String
       
    },
    date: {
        type: Date,
        default:Date.now
    }
});
module.expot = mongoose.model('notes ', NotesSchema);