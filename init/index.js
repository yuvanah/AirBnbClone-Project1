const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const axios = require("axios");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  const updatedData = await Promise.all(initData.data.map(async (obj) => {
    let geoData;
    try {
      const res = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
          q: obj.location,
          format: "json"
        },
        headers: {
          'User-Agent': 'WanderlustSeeder/1.0'
        }
      });

      if (res.data.length) {
        geoData = {
          type: "Point",
          coordinates: [parseFloat(res.data[0].lon), parseFloat(res.data[0].lat)]
        };
      }
    } catch (e) {
      console.log("error with location:", obj.location);
    }

    return {
      ...obj,
      owner: "687bf1b42a9acda2ae05d10f",
      geometry: geoData || undefined
    };
  }));

  await Listing.insertMany(updatedData);
  console.log("data was initialized");
};

initDB();
