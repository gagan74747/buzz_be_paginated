const cloudinary = require("../utils/cloudinary");
const mongoose = require("mongoose");
const Feed = require("../models/feed")

async function deletePost(req, res) {
    try {
        if (!req.user.is_Admin)
            return res.status(401).json({ message: "Only Admins can delete posts" });

        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).json({ message: `Not a valid id: ${id}` });
        let feed = await Feed.findById(id);
        if (feed) {
            feed.cloudinaryId &&
                (await cloudinary.uploader.destroy(feed.cloudinaryId));
            //delete post from db
            await feed.remove();
            res.status(200).json({ message: "Post deleted", data: feed });
        } else
            res.status(401).json({ message: "Feed not found" });
        } catch (err) {
        res.status(400).json({ message: " " + err });
    }
}
   async function postStatus(req,res){
       try{
        if (!req.user.is_Admin)
        return res.status(401).json({ message: "Only Admins can handle posts status" });
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).json({ message: `Not a valid id: ${id}` });
        let feed = await Feed.findById(id);
        if(!feed)
        return res.status(401).json({ message: "Feed not found" });
        if(feed.status==="active")
        feed.status="disabled";
        else
        feed.status="active";
        feed.createdBy=feed.createdBy;
        await feed.save();
        res.status(200).json({ message: "Post toggled", data: feed });
       }
       catch(err){
        res.status(400).json({ message: " " + err });
       }
   }
   async function getFeeds(req,res){
   try{
   if (!req.user.is_Admin)
   return res.status(401).json({ message: "Only Admins can handle posts status" });
   const { pageLimit, pageNumber } = req.query;
   feedCount = await Feed.find({}).count();
   let feeds = await Feed.find({}).populate('createdBy', "firstname lastname profile_img ").sort({ createdAt: -1 }).limit(pageLimit).skip((pageNumber - 1) * pageLimit);
   res.status(200).json({ feedCount: feedCount,pageCount:feeds.length, feeds });
   }catch (error) {
   res.status(400).json({ "message": "" + error });
   }}
     
module.exports.deletePost=deletePost;
module.exports.postStatus=postStatus;
module.exports.getFeeds=getFeeds;

