const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedin,isOwner,validateList} = require("../middleware.js");
const listingController = require("../controllers/listing.js")

const multer = require("multer");
const {storage} = require("../cloudConfig.js")
const upload = multer({storage}); 


router
 .route("/")
     .get(wrapAsync(listingController.index)) 
     .post(isLoggedin,upload.single("list[image]"), wrapAsync(listingController.createListing)); 
    
 
router.get("/new",isLoggedin,listingController.renderNewForm);



router
   .route("/:id")
       .get(wrapAsync(listingController.showListing)) 
       .put(isLoggedin,isOwner,validateList,upload.single("list[image]"),wrapAsync(listingController.updateListing)) 
       .delete(isLoggedin,isOwner,wrapAsync(listingController.destoryListing));


   




router.get("/:id/edit",isLoggedin,wrapAsync(listingController.renderEditForm));



module.exports = router;


