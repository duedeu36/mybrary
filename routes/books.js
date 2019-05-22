// ***** All Routes here are going through "/authors" because it's settup in server.js *****

const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const multer = require("multer");
const path = require("path"); // path + multer for upload neccessary (like coverImageBasePath in model)
const uploadPath = path.join("public", Book.coverImageBasePath);
const Author = require("../models/author");
const imageMimeTypes = ["images/jpeg", "images/png", "images/gif"]; // which files we accept
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null);
  }
});

// Get all books route
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.title != null && req.query.title !== "") {
    searchOptions.title = new RegExp(req.query.title, "i");
  }
  try {
    const books = await Book.find(searchOptions);
    res.render("books/index", {
      books: books,
      searchOptions: req.query
    });
  } catch (e) {
    res.redirect("/");
  }
});

// New book route
router.get("/new", async (req, res) => {
  renderNewPage(res, new Book());
});

// Create book route
router.post("/", upload.single("cover"), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;
  const book = new Book({
    title: req.body.title, // name comes from the input name="title" in _form_fields.ejs
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    coverImageName: fileName,
    description: req.body.description
  });
  try {
    const newBook = await book.save();
    // res.redirect(`books/${newBook.id}`)
    res.redirect(`books`);
  } catch (e) {
    renderNewPage(res, book, true);
  }
});

async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors: authors,
      book: book
    };
    if (hasError) params.errorMessage = "Error while creating book";
    res.render("books/new", params);
  } catch (e) {
    res.redirect("/books");
  }
}

module.exports = router;
