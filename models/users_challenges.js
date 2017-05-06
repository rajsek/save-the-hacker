var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var userChallengeSchema = new Schema({
    id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    id_chellenge: { type: Number, required: true },
    continent: { type: String, required: true },
    is_won: { type: Boolean },
}, { timestamps: { createdAt: 'date_palyed', updatedAt: 'date_updated' } });

var UserChallenge = mongoose.model('UserChallenges', userChallengeSchema);
module.exports = UserChallenge;
