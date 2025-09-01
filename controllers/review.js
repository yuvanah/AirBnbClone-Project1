const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async(req,res)=>{

   let listing = await Listing.findById(req.params.id);
   let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
   listing.reviews.push(newReview._id) ;
   await newReview.save();
   await listing.save();
    req.flash("success","new review created");
 res.redirect(`/listings/${listing._id}`);

};


module.exports.destoryReview = async(req,res)=>{
 let {id,reviewId} = req.params;

 await Listing.findByIdAndUpdate(id, {$pull :{reviews: reviewId}});
 await Review.findByIdAndDelete(reviewId);
  req.flash("success","review deleted");
 res.redirect(`/listings/${id}`);
};
