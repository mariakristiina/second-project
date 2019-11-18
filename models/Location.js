const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const locationSchema = new Schema({
  latitude: Number,
  longitude: Number
  // {
  //   // enum: []
  //   // default: [locations[0]],
  //   // required: true
  // },
  // owner: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User"
  // }
})

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;