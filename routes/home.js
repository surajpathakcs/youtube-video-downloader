const express = require("express");
const router = express.Router();
const {handleView ,handleDownloadRequest}  = require("../controllers/home"); // Import the correct controller

// Define the route
router.get('/', handleView);
router.post('/',handleDownloadRequest);

module.exports = router;
