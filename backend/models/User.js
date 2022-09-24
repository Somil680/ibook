const mongoose =  require('mongoose');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required:true
    },
    date: {
        type: Date,
        default:Date.now
    }
});
module.expot = mongoose.model('user ', UserSchema);