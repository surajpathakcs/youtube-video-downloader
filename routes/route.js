const express = require("express");
const router = express.Router();
const homeController = require("../controllers/route");
const handleView = require("../controllers/route");

router.get("/",handleView);

module.exports = router;
