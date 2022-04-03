const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Word = new Schema({
    word: {
        type: Schema.Types.String,
        required: true
    }
},{
    timestamps: true
});

module.exports = mongoose.model('Word', Word);