// ***** All Routes here are going through "/authors" because it's settup in server.js *****

const express = require("express");
const router = express.Router();
const Author = require("../models/author");

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
    // res.redirect(`authors/${newAuthor.id}`)
    res.redirect(`authors`);
  } catch (e) {
    res.render("authors/new", {
      author: author,
      errorMessage: "Error creating Author"
    });
  }
});

module.exports = router;
