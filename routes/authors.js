// ***** All Routes here are going through "/authors" because it's settup in server.js *****
const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const Book = require("../models/book");

// Get all authors route
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== "") {
    // the "i" makes it to not difference between lower and upper case.. e.g. John/john
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  try {
    const authors = await Author.find(searchOptions);
    res.render("authors/index", {
      authors: authors, // the document which has to be rendered (displayed on the screen)
      searchOptions: req.query
    });
  } catch (e) {
    res.redirect("/");
  }
});

// New author route
router.get("/new", async (req, res) => {
  res.render("authors/new", { author: new Author() }); // the document which has to be rendered (displayed on the screen)
});

// Create author route
router.post("/", async (req, res) => {
  const author = new Author({
    name: req.body.name // name comes from the input name="name" in _form_fields.ejs
  });
  try {
    const newAuthor = await author.save();
    res.redirect(`authors/${newAuthor.id}`);
  } catch (e) {
    res.render("authors/new", {
      author: author,
      errorMessage: "Error creating Author"
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    const books = await Book.find({ author: author.id })
      .limit(6)
      .exec();
    res.render("authors/show", {
      author: author,
      booksByAuthor: books
    });
  } catch (e) {
    console.log(e);
    res.redirect("/");
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.render("authors/edit", { author: author });
  } catch (e) {
    res.redirect("/authors");
  }
});

router.put("/:id", async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    author.name = req.body.name;
    await author.save();
    res.redirect(`/authors/${author.id}`);
  } catch (e) {
    if (author == null) {
      res.redirect("/");
    } else {
      res.render("/authors/edit", {
        author: author,
        errorMessage: "Error updating Author"
      });
    }
  }
});

router.delete("/:id", async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    await author.remove();
    res.redirect("/authors");
  } catch (e) {
    if (author == null) {
      res.redirect("/");
    } else {
      res.redirect(`/authors/${author.id}`);
    }
  }
});

module.exports = router;
