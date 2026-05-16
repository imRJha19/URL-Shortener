const express = require("express");
const { connectToMongo } = require("./connect");
const path = require("path");
const session = require("express-session");

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");
const URL = require("./models/url");

const app = express();
const port = 8080;

/* -------------------- MIDDLEWARE -------------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "url-shortener-secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Make session data available in EJS
app.use((req, res, next) => {
  res.locals.userName = req.session.userName || null;
  next();
});

/* -------------------- DB -------------------- */
connectToMongo("mongodb://localhost:27017/short-url")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

/* -------------------- VIEW ENGINE -------------------- */
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

/* -------------------- ROUTES -------------------- */
app.use("/url", urlRoute);
app.use("/users", userRoute);
app.use("/", staticRoute);

/* -------------------- REDIRECT -------------------- */
app.get("/:shortId", async (req, res) => {
  try {
    const shortId = req.params.shortId;

    const entry = await URL.findOneAndUpdate(
      { shortId },
      { $push: { visitHistory: { timestamp: Date.now() } } },
      { new: true }
    );

    if (!entry) return res.status(404).send("Short URL not found");

    res.redirect(entry.redirectURL);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

/* -------------------- SERVER -------------------- */
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
