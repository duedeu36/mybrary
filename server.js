const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");

const indexRouter = require("./routes/index");

const mongoose = require("mongoose");
// mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
// db config
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

app.use("/", indexRouter);

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server running on port ${port}`));
