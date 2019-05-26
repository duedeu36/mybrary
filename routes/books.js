// ***** All Routes here are going through "/authors" because it's settup in server.js *****

const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const Author = require("../models/author");
const imageMimeTypes = ["images/jpeg", "images/png", "images/gif"]; // which files we only accept

// @route   GET books/
// @desc    Get all books route
// @access  Public
router.get("/", async (req, res) => {
  let query = Book.find();
  if (req.query.title != null && req.query.title != "") {
    query = query.regex("title", new RegExp(req.query.title, "i"));
  }
  if (req.query.publishedBefore1 != null && req.query.publishedBefore1 != "") {
    // "publishDate" comes from the db
    // "lte" is from mongo and means less then (or) equal to
    query = query.lte("publishDate", req.query.publishedBefore1);
  }
  if (req.query.publishedAfter2 != null && req.query.publishedAfter2 != "") {
    // "publishDate" comes from the db
    // "lte" is from mongo and means greater then (or) equal to
    query = query.gte("publishDate", req.query.publishedAfter2);
  }
  try {
    const books1 = await query.exec();
    res.render("books/index", {
      books1: books1,
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

// @route   POST books/
// @desc    Create book route
// @access  Public
router.post("/", async (req, res) => {
  const book = new Book({
    title: req.body.title, // name comes from the input name="title" in _form_fields.ejs
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description
  });
  saveCover(book, req.body.cover);
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

function saveCover(book, coverEncoded) {
  if (coverEncoded == null) return;
  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, "base64");
    book.coverImageType = cover.type;
  }
}
module.exports = router;
