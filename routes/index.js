// ***** All Routes here are going through "/" because it's settup in server.js *****

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  // server route: "/", so index.ejs content comes on route "localhost:8000/" but if server route is "/test" then index.ejs content will be on "localhost:8000/test"
  res.render("index"); // /home/dmrlcc/Desktop/projects/mybrary/views/index.ejs
});

module.exports = router;
