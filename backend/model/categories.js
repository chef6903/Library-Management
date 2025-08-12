const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },  // tên thể loại
    description: String,                                   // mô tả thể loại
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

categorySchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Category', categorySchema);
