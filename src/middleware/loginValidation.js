const Joi = require("joi");

const loginSchema = Joi.object({
    email: Joi.string().email().min(8).pattern(new RegExp("^[A-Za-z0-9._+]{3,}@tothenew.com$")).required(),
    password: Joi.string().required()
});
   async function loginValidation(req, res, next) {
    try {
        const email = req.body.email;
        const password = req.body.password;
        await loginSchema.validateAsync({ email, password });
        next();
         }
    catch (err) {
        if (err.details[0].type === "string.pattern.base" && err.details[0].message.indexOf("email") !== -1) {
             return res.status(401).json({message:"A valid TTN email is allowed or Enter a valid email"})
        }
            return res.status(401).json({message:""+err});
        }
       }
module.exports = loginValidation;
