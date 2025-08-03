const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js")


 const listingSchema = new Schema({
    title: {
        type:String,
        required:true
    },
    description: {
        type:String,
       
    },
    image:{
      url: String,
      filename: String,
    },

    price: Number,
    location: String,
    country:String,

    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner:{
      type: Schema.Types.ObjectId,
      ref: "User",
    },

   geometry: {
       type: {
       type: String,
       enum: ['Point'],
       required: true,
       default: 'Point'
  },
  coordinates: {
    type: [Number], 
    required: true
  }
}

 });

 
listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
    await Review.deleteMany({
      _id: { $in: listing.reviews } 
    });
  }
});


 const Listing = mongoose.model("Listing",listingSchema);

 module.exports = Listing;
 