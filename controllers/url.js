const { nanoid } = require("nanoid");
const URL = require("../models/url");

async function handlegenerateNewShortURL(req, res) {
  const { url } = req.body;
  if (!url) return res.status(400).send("URL is required");

  const userId = req.session.userId;

  // Check if URL already exists for this user
  let existing = await URL.findOne({ redirectURL: url, createdBy: userId });

  if (existing) {
    const allUrls = await URL.find({ createdBy: userId });
    return res.render("home", {
      id: existing.shortId,
      urls: allUrls,
      userName: req.session.userName,
    });
  }

  const shortID = nanoid(8);
  await URL.create({
    shortId: shortID,
    redirectURL: url,
    visitHistory: [],
    createdBy: userId,
  });

  const allUrls = await URL.find({ createdBy: userId });
  res.render("home", {
    id: shortID,
    urls: allUrls,
    userName: req.session.userName,
  });
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  if (!result) return res.status(404).json({ message: "Short URL not found" });

  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = {
  handlegenerateNewShortURL,
  handleGetAnalytics,
};
