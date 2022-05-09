const mongoose = require('mongoose')

const BookSchema = new mongoose.Schema({
    title: {type: String, required: true},
    comments: [String],
    commentcount: {type: Number, default: 0}
})

const Books = mongoose.model('books', BookSchema)

module.exports = Books