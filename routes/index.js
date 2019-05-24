// ***** All Routes here are going through "/" because it's settup in server.js *****

const express = require("express");
const router = express.Router();
// We need the book model to use it here
const Book = require("../models/book");

router.get("/", async (req, res) => {
  // Order books by recently added:
  let books;
  try {
    // 'desc' is the order type for newest first
    // 'createdAt' comes from the model bzw. db
    books = await Book.find()
      .sort({ createdAt: "desc" })
      .limit(10)
      .exec();
  } catch (e) {
    // if error, render the books in a empty array (tutorial video 49:31 at min 47:05)
    books = [];
  }
  // server route: "/", so index.ejs content comes on route "localhost:8000/" but if server route is "/test" then index.ejs content will be on "localhost:8000/test"
  //   books are added into the books1 array from index.ejs
  res.render("index", { books1: books }); // /home/dmrlcc/Desktop/projects/mybrary/views/index.ejs
});

module.exports = router;
