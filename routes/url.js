const express = require("express");
const router = express.Router();
const { handlegenerateNewShortURL, handleGetAnalytics } = require("../controllers/url");

// Create new short URL
router.post("/", handlegenerateNewShortURL);

// Get analytics
router.get("/analytics/:shortId", handleGetAnalytics);

module.exports = router;
