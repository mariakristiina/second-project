// Seeds file that remove all users and create 2 new users

// To execute this seed, run from the root of the project
// $ node bin/seeds.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Location = require("../models/Location");
const Truck = require("../models/Truck");

const bcryptSalt = 10;

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost/second-project", {
    useNewUrlParser: true,
  })
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
    sowSeeds();
  })
  .catch((err) => {
    console.error("Error connecting to mongo", err);
  });

let users = [
  {
    username: "alice",
    password: bcrypt.hashSync("alice", bcrypt.genSaltSync(bcryptSalt)),
  },
  {
    username: "bob",
    password: bcrypt.hashSync("bob", bcrypt.genSaltSync(bcryptSalt)),
  },
];

// User.deleteMany()
//   .then(() => {
//     return User.create(users)
//   })
//   .then(usersCreated => {
//     console.log(`${usersCreated.length} users created with the following id:`);
//     console.log(usersCreated.map(u => u._id));
//   })
//   .then(() => {
//     // Close properly the connection to Mongoose
//     mongoose.disconnect()
//   })
//   .catch(err => {
//     mongoose.disconnect()
//     throw err
//   })

// seeds for food trucks

const userSeeds = [
  {
    username: String,
    password: String,
    truck: {
      type: Boolean,
      default: false,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Truck",
      },
    ],
  },
];

const truckSeeds = [
  //   {
  //   name: "Zwei Dicke Bärren",
  //   description: "",
  //   cuisine: "",
  //   owner: {
  //     username: String,
  //     password: String,
  //     truck: true,
  //     likes: [{
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "Truck"
  //     }]
  //   },
  //   tags: "dessert",
  //   locations: {
  //     locations: [
  //       [52.3125, 13.2603]
  //     ]
  //   },
  //   hours: [12, 19],
  //   image: "https://img.theculturetrip.com/1024x/wp-content/uploads/2016/08/dsc05253.jpg",
  //   rating: "",
  // },

  {
    name: "Big Stuff Smoked BBQ",
    owner: null,
    cuisine: "American",
    tags: "barbeque",
    locations: [[52.497014, 13.454328]],
    rating: 8,
    // menu: null,
    hours: [12, 22],
  },
  {
    name: "Humble Pie",
    // owner: null,
    cuisine: "British",
    tags: "dessert",
    locations: {
      locations: [[52.496998, 13.45416]],
      // owner: null
    },
    rating: 8,
    // menu: null,
    hours: [12, 22],
  },
  {
    name: "Bunsmobile",
    // owner: null,
    cuisine: "American",
    tags: "burger",
    locations: [[[52.486324, 13.435324]]],
    // owner: null
    rating: 8,
    // menu: null,
    hours: [18, 22],
  },
  {
    name: "Maria Maria Arepas",
    // owner: null,
    cuisine: "Latin American",
    tags: "arepas",
    // locations: null,
    rating: 8,
    // menu: null,
    hours: [12, 20],
  },
];
// {
//   name: "Singleton Whisky Bar",
//   // owner: null,
//   cuisine: "alcohol",
//   tags: "whisky",
//   // locations: null,
//   rating: 8,
//   // menu: null,
//   hours: [18, 23]
// }, {
//   name: "PIC NIC 34",
//   // owner: null,
//   cuisine: "Italian",
//   tags: "pizza",
//   // locations: null,
//   rating: 8,
//   // menu: null,
//   hours: [15, 22]
// }, {
//   name: "Laksa Berlin",
//   // owner: null,
//   cuisine: "Asian",
//   tags: "asian",
//   // locations: null,
//   rating: 8,
//   // menu: null,
//   hours: [18, 22]
// }, {
//   name: "Mamas Banh",
//   // owner: null,
//   cuisine: "Vietnamese",
//   tags: ["asian", "vegetarian"],
//   // locations: null,
//   rating: 8,
//   // menu: null,
//   hours: [18, 22]
// }, {
//   name: "Tausendsuend Cakes",
//   // owner: null,
//   cuisine: "Vietnamese",
//   tags: ["dessert"],
//   // locations: null,
//   rating: 8,
//   // menu: null,
//   hours: [18, 22]
// }, {
//   name: "Sun Day Burgers",
//   // owner: null,
//   cuisine: "American",
//   tags: "burger",
//   // locations: null,
//   rating: 8,
//   // menu: null,
//   hours: [18, 22]
// }];

// add seeds to database

function sowSeeds() {
  Truck.find({}).then((res) => {
    if (!res) {
      truckSeeds.forEach((truck) => {
        Location.create(truck.locations[0])
          .then((dblocation) => {
            // console.log('TEST ', truckSeeds)
            truckSeeds.locations = dblocation._id;
            console.log("LOOOK HERE", truck);
            console.log("snother tessssssst", dblocation);
            return Truck.create(truck);
          })
          .then(() => {
            console.log(truck);
            console.log("trucks added to database!");
            mongoose.connection.close();
          })
          .catch((err) => {
            console.log(err);
          });
      });
    }
    mongoose.connection.close();
  });
}
