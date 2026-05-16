const User = require("../models/user");
const bcrypt = require("../node_modules/bcryptjs/umd");

async function handleUserSignup(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send("All fields are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).send("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // ✅ Save in session
  req.session.userId = user._id;
  req.session.userName = user.name;

  res.redirect("/");
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("All fields are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).send("Invalid email or password");
  }

  // ✅ Create session
  req.session.userId = user._id;
  req.session.userName = user.name;

  res.redirect("/");
}

function handleUserLogout(req, res) {
  req.session.destroy(() => {
    res.redirect("/login");
  });
}



module.exports = {
  handleUserSignup,
  handleUserLogin,
  handleUserLogout,
};
