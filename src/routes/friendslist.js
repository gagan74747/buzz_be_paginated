const express = require('express');
const mongoose = require('mongoose');
const Users = require('../models/users');
const friendslist = require("../routes/friendslist");
const router = require('express').Router();

//get friendslist

router.get("/friends/:friendslist_Id", async (req, res) => {

    try {
        const friendslist = await friends.findById(req.params.friendslist_Id);
        const friends = await Promise.all(
            friendslist.following.map(friend_Id => {
                return friends.findById(friend_Id);

            })
        );
        let friendList = [];
        friends.map((friend) => {
            const { _id, username } = friend;
            friendList.push({ _id, username });
        });
        res.status(200).json(friendsList);
    } catch (err) {
        res.status(500).json(err);


    }

})
module.exports = router;
