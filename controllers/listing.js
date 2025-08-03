const Listing = require("../models/listing.js");
const axios = require("axios");


module.exports.index = async(req,res)=>{
  const allListing = await Listing.find({});
  res.render("./listing/index.ejs",{lists: allListing});

};

module.exports.renderNewForm = (req,res)=>{

  res.render("listing/new.ejs");
};

module.exports.showListing = async(req,res)=>{
     let {id} = req.params;
   const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}) .populate("owner");
   if(!listing){
      req.flash("error", "Listing you reqested for does not exisit");
     return  res.redirect("/listings");
   }
   res.render("listing/show.ejs",{list:listing});

};



module.exports.createListing = async (req, res,) => {
  let url = req.file.path;
  let filename = req.file.filename;

  
  const locationText = req.body.list.location;
  const nominatimURL = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationText)}`;

  const response = await axios.get(nominatimURL, {
    headers: { 'User-Agent': 'Mithun-Leaflet-App' }
  });

  const data = response.data;

  if (!data[0]) {
    req.flash("error", "Location not found");
    return res.redirect("/listings/new");
  }

  const lat = parseFloat(data[0].lat);
  const lon = parseFloat(data[0].lon);

  const newListing = new Listing(req.body.list);
  newListing.geometry = {
    type: "Point",
    coordinates: [lon, lat] // GeoJSON format
  };
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
 

  await newListing.save();
  req.flash("success", "New listing created");
  res.redirect("/listings");
};


module.exports.renderEditForm = async(req,res)=>{
let {id} = req.params; 
   const listing = await Listing.findById(id);
   if(!listing){
      req.flash("error", "Listing you reqested for does not exisit");
     return  res.redirect("/listings");
   }
  let orginalImageUrl =  listing.image.url;
 orginalImageUrl = orginalImageUrl.replace("/upload", "/upload/w_400,h_200,c_fill,q_30");

   res.render("listing/edit.ejs",{list:listing,orginalImageUrl});


};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  const locationText = req.body.list.location;
  const nominatimURL = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationText)}`;

  const response = await axios.get(nominatimURL, {
    headers: { 'User-Agent': 'Mithun-Leaflet-App' }
  });

  const data = response.data;

  if (!data[0]) {
    req.flash("error", "Location not found");
    return res.redirect(`/listings/${id}/edit`);
  }

  const lat = parseFloat(data[0].lat);
  const lon = parseFloat(data[0].lon);

  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "you don't have permission to edit");
    return res.redirect(`/listings/${id}`);
  }

  
  let updatedlisting = await Listing.findByIdAndUpdate(id, req.body.list);

  
  updatedlisting.geometry = {
    type: "Point",
    coordinates: [lon, lat]
  };

 
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    updatedlisting.owner = req.user._id;
    updatedlisting.image = { url, filename };
  }


  await updatedlisting.save();

  req.flash("success", "Listing updated");
  res.redirect(`/listings/${id}`);
};


module.exports.destoryListing = async (req,res)=>{
   let{id} = req.params;
  await  Listing.findByIdAndDelete(id);
   req.flash("success","Listing deleted");
  res.redirect("/listings");
};
