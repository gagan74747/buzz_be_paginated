const jwt = require("jsonwebtoken");
const User = require("../models/users");

async function Authenticate(req, res, next) {
    try {

        const token = req.cookies.jwtoken;
        if (!token) {
            res.status(307).json({ message: "redirect" })
            return;
        }
        const verifytoken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const rootuser = await User.findOne({ _id: verifytoken._id, is_Admin: verifytoken.is_Admin });
        if (!rootuser)
            throw new Error("redirect")
        req.user = rootuser;
        req.user_id = rootuser._id;
        next();
    }
    catch (err) {
        console.log(err)
        res.status(307).json({ message: "redirect" })
    }
}
module.exports = Authenticate;
