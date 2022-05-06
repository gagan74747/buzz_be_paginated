const Feed = require("../models/feed");
const cloudinary = require("../utils/cloudinary");
const mongoose = require("mongoose");

exports.createFeed = async (req, res) => {
  const { text } = req.body;
  userid = req.user_id.toString()
  const userName = req.user.firstname + ' ' + req.user.lastname
  console.log(userName)

  try {
    let result;
    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path);
    }
    //instance of post
    const data = {
      createdBy: userid,
      text: text,
      status: "active",
      imgLink: result?.secure_url || "",
      cloudinaryId: result?.public_id || "",
      userName: userName
    };
    let feed = new Feed(data);
    //saving post
    await feed.save();
    res.status(201).json({ message: "success", feed });
  } catch (error) {
    res.status(401).json({ "message": "" + error });
  }
};

exports.getFeeds = async (req, res) => {
  try {
    const { pageLimit, pageNumber } = req.query;
    feedCount = await Feed.find({status:"active",createdBy:{$in:[req.user_id,...req.user.friends.myFriends]}}).count()
    let feeds = await Feed.find({status:"active",createdBy:{$in:[req.user_id,...req.user.friends.myFriends]}}).populate('createdBy', "firstname lastname profile_img ").sort({ createdAt: -1 }).limit(pageLimit).skip((pageNumber - 1) * pageLimit);
    res.status(200).json({ feedCount: feedCount,pageCount:feeds.length, feeds });
  } catch (error) {
    res.status(400).json({ "message": "" + error });
  }
}

exports.deleteFeed = async (req, res, next) => {
  try {
    //valid object id check
    userid = req.user_id.toString()
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`Not a valid id: ${id}`);

    //post find
    let feed = await Feed.findById(id);
    if (feed) {
      //delete from cloudinary
      if (feed.createdBy.toString() === userid) {
        feed.cloudinaryId &&
          (await cloudinary.uploader.destroy(feed.cloudinaryId));
        //delete post from db
        await feed.remove();
        res.status(200).json({ message: "Post deleted", data: feed });
      } else
        res.status(401).json({ message: "Invalid User" });
    } else
      res.status(401).json({ message: "Feed not found" });
  } catch (error) {
    res.status(400).json({ message: "" + error });
  }
};

exports.updateFeed = async (req, res, next) => {
  try {
    let result;
    const { id } = req.params;
    userid = req.user_id.toString()
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send(`Not a valid id: ${id}`);
    }
    let feed = await Feed.findById(id);
    if (feed.createdBy === userid) {
      // console.log(req.file)
      // // Delete image from cloudinary
      if (req.file) {
        feed.cloudinaryId &&
          (await cloudinary.uploader.destroy(feed.cloudinaryId));
        // // Upload image to cloudinary
        result = await cloudinary.uploader.upload(req.file.path);
      }
    } else {
      res.status(401).json("Invalid User");
    }
    const data = {
      imgLink: result?.secure_url || feed.imgLink,
      cloudinaryId: result?.public_id || feed.cloudinaryId,
      text: req.body.text,
    };
    feed = await Feed.findByIdAndUpdate(id, data, { new: true });
    res.status(200).json(feed);
  } catch (err) {
    res.status(400).json({ "message": "" + err });
  }
};
exports.likeFeed = async (req, res, next) => {
  try {
    //getting ids
    const feedid = req.params.id;
    const userid = req.user_id.toString();
    //validating 
    if (!mongoose.Types.ObjectId.isValid(feedid)) return res.status(404).send(`Not a valid id: ${feedid}`);
    //finding in db
    let feed = await Feed.findById(feedid);

    if (feed) {
      //checking for existence of id 
      const index = userid && feed.likeCount.findIndex((id) => id === userid);

      if (index === -1) {
        feed.likeCount.push(userid);        //pushing if id not present
      } else {
        feed.likeCount = feed.likeCount.filter((id) => id !== userid); //removing if id is present
      }
      //updation in database
      const updatedFeed = await Feed.findByIdAndUpdate(feedid, feed, { new: true });

      res.status(200).json(updatedFeed);
    } else
      res.status(404).json("No post with given id");
  }
  catch (error) {
    res.status(400).json({ "message": "" + error });
  }

}
exports.flagFeed = async (req, res, next) => {
  try {
    //getting ids
    const feedid = req.params.id;
    const userid = req.user_id.toString();
    //validating 
    if (!mongoose.Types.ObjectId.isValid(feedid)) return res.status(404).send(`Not a valid id: ${feedid}`);
    //finding in db
    let feed = await Feed.findById(feedid);

    if (feed && feed.createdBy !== userid) {
      //checking for existence of id 
      const index = userid && feed.flagCount.findIndex((id) => id === userid);

      if (index === -1) {
        feed.flagCount.push(userid);        //pushing if id not present
      } else {
        feed.flagCount = feed.flagCount.filter((id) => id !== userid); //removing if id is present
      }
      //updation in database
      const updatedFeed = await Feed.findByIdAndUpdate(feedid, feed, { new: true });

      res.status(200).json(updatedFeed);
    } else
      res.status(404).json({ message: "No post with given id or cannot flag self" });
  }
  catch (error) {
    res.status(400).json({ "message": "" + error });
  }
}
