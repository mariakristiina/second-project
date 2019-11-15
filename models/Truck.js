const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const truckSchema = new Schema({
  name: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
  cuisine: {
    type: String,
    enum: ["Latin American", "Italian", "German", "Mediterranean", "Vietnamese", "Chinese", "American", "alcohol"],
    required: true
  }
  tags: {
    type: String,
    enum: ["vegetarian", "vegan", "barbeque", "burger", "asian", "dumplings", "pizza", "dessert"],
  }
});
const Truck = mongoose.model("Truck", truckSchema);
module.exports = Truck;