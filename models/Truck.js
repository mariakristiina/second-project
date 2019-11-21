const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const truckSchema = new Schema({
  name: String,
  description: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  cuisine: {
    type: String,
    enum: ["Latin American", "Italian", "German", "Mediterranean", "Vietnamese", "Chinese", "American", "Cocktails/drinks", "Asian Fusion", "Dessert", 'British', "Coffee", "Mexican"],
    // required: true
  },
  // tags: {
  //   type: String,
  //   enum: ["vegetarian", "vegan", "barbeque", "burger", "asian", "dumplings", "pizza", "dessert"],
  // },
  tags: Array,
  locations: Array,
  // locations: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Location"
  // }],
  rating: Number,
  menu: String,
  hours: String,
  image: String
});


const Truck = mongoose.model("Truck", truckSchema);
module.exports = Truck;