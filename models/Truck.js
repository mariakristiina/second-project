const Schema = mongoose.Schema;
const truckSchema = new Schema({
  name: String,
  cuisine: ["Latin American", "Italian", 'German', ‘Mediterranean’, ‘Vietnamese’, ‘Chinese’, ‘American’, ‘alcohol’],
  tags: [‘vegetarian’, ‘vegan’, ‘barbeque’, ‘burger’, ‘asian’, ‘dumplings’, ‘pizza’, ‘dessert’, ]
});
const Truck = mongoose.model("Truck", truckSchema);
module.exports = Truck;