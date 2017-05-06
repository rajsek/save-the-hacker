var mongoose = require("mongoose-q")();
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var userSchema = new Schema({
    id_fb: {type: Integer, required: true},
    first_name: {type: String, required: true},
    last_name: {type: String, required: true}
}, {timestamps: {createdAt: 'date_auth', updatedAt: 'date_last_visit'}});

userSchema.virtual('id_user').get(function(){
    return this._id;
});

var Users = mongoose.model('Users', userSchema);
module.exports = Users;
