const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");

const indexRouter = require("./routes/index");
const authorRouter = require("./routes/authors");
const bookRouter = require("./routes/books");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const db = require("./config/keys").mongoURI;

mongoose
  .connect(db, {
    useNewUrlParser: true
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.log(err));

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use(methodOverride("_method"));
app.use("/", indexRouter);
app.use("/authors", authorRouter);
app.use("/books", bookRouter);

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server running on port ${port}`));
