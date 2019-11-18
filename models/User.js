const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  truck: {
    type: String,
    enum: ["YES", "NO"],
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  location: String,
  favorites: [],
});

const User = mongoose.model('User', userSchema);
module.exports = User;
