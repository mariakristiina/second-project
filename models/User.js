const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  truck: {
    type: Boolean,
    default: false,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Truck"
  }],
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
