const express = require("express");
const router = express.Router();

// Get all authors route
router.get("/", (req, res) => {
  res.render("authors/index");
});

// New author route (for displaying the form)
router.get("/new", (req, res) => {
  res.render("authors/new");
});

// Create author route
router.post("/", (req, res) => {
  res.send("create");
});

module.exports = router;
