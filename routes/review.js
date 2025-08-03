const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");


const {isLoggedin,validateReview, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/review.js");







router.post("/",isLoggedin,validateReview,wrapAsync(reviewController.createReview));



router.delete("/:reviewId",isLoggedin,isReviewAuthor,wrapAsync(reviewController.destoryReview));

module.exports = router;
