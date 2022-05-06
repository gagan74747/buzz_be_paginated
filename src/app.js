const mongoose = require('mongoose');
const express = require('express');
const comments = require('./routes/comments');
const friends = require("./routes/friends");
const logout=require('./routes/logout');
const searchsuggestions=require('./routes/searchsuggestions')
const suggestions=require("./routes/suggestions.js");
const app = express();
require("dotenv").config();
const feed = require("./routes/feed");
const userProfile = require("./routes/userProfile");
const userauth = require("./routes/auth.js");
const googleauth=require("./routes/googleauth.js");
const forgotpassword=require("./routes/forgotpassword.js");
const moderator=require("./routes/moderator");
var cookieParser = require('cookie-parser');
const authenticate = require('./middleware/authenticate')
mongoose.connect("mongodb://localhost/buzz")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));

app.use(express.json());
app.use(cookieParser());
app.use("/api/comments", authenticate,comments);
app.use("/api/friends",authenticate,friends );
app.use("/api/feed",authenticate, feed);
app.use("/api", userauth);
app.use("/api/search",searchsuggestions);
app.use("/auth/google", googleauth);
app.use("/api/forgotpassword", forgotpassword);
app.use("/api/userprofile",authenticate, userProfile);
app.use("/api/moderator",moderator);
app.use("/api/suggestions",authenticate,suggestions);
app.use("/api/logout",logout);
app.get('/home', authenticate, async (req, res) => {

  res.status(200).json({
    fName: req.user.firstname,
    lName: req.user.lastname,
    userId: req.user_id,
    profileImg: req.user.profile_img,
    is_Admin:req.user.is_Admin,
    profile_img:req.user.profile_img,
    user_id:req.user_id,
    friendRequestCount:req.user.friends.myFriendRequests.length
  })
});
process.on('uncaughtException', (ex) => {
  console.log("We got uncaught exception", ex);
  process.exit(1);
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: '' + err })
})


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
