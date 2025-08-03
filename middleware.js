const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");


module.exports.isLoggedin =  (req,res,next)=>{
     if(!req.isAuthenticated()){
        //redriecturl save 
        req.session.redirectUrl = req.originalUrl;
    req.flash("error","you must be logged to create listing");
   return res.redirect("/login");
  }
  next();
}

module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
       
    }
    next();
}

module.exports.isOwner  = async(req,res,next)=>{
    let{id} = req.params;
   let listing  = await  Listing.findById(id);
   if(!listing.owner.equals(res.locals.currUser._id)){
         req.flash("error","you are not the owner of this listing");
       return   res.redirect(`/listings/${id}`);
   }
   next();
}

module.exports.validateList = (req,res,next) =>{
  let {error} = listingSchema.validate(req.body);
  // console.log(error); -> has lot of objects , we can print in detial as well
  if(error){
    let errMsg = error.details.map((el)=> el.message).join(" , ");
    console.log(errMsg);
    throw new ExpressError(400,errMsg);
  }
  else{
    next();
  }
};

module.exports.validateReview = (req,res,next) =>{
  let {error} = reviewSchema.validate(req.body);
  // console.log(error); -> has lot of objects , we can print in detial as well
  if(error){
    let errMsg = error.details.map((el)=> el.message).join(" , ");
    console.log(errMsg);
    throw new ExpressError(400,errMsg);
  }
  else{
    next();
  }
};

module.exports.isReviewAuthor  = async(req,res,next)=>{
    let{id, reviewId} = req.params;
   let review  = await  Review.findById(reviewId);
   if(!review.author.equals(res.locals.currUser._id)){
         req.flash("error","you are not the author of this review");
       return   res.redirect(`/listings/${id}`);
   }
   next();
}
