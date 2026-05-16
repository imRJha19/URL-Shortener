const express = require("express");
const URL = require("../models/url");
const router = express.Router();

// Home page
router.get("/", async (req, res) => {
    if (!req.session.userId) {
    return res.redirect("/login");
  }
  const urls = await URL.find({ createdBy: req.session.userId || null });
  res.render("home", {
    urls,
    id: null,
    userName: req.session.userName || null,
  });
});

// Signup page
router.get("/signup", (req, res) => {
  res.render("signup");
});

//login page 
router.get("/login", (req, res) => {
  res.render("login");
});

module.exports = router;
