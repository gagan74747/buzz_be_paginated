const router = require("express").Router();
router.get("/", (req, res) => {
    res.clearCookie("jwtoken");
    res.status(200).json({ message: "logout" });
});
module.exports = router;
