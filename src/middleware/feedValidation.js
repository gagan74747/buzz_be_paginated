const Joi = require("joi");

const feedSchema = Joi.object({
  text: Joi.string().min(5),
  createdBy: Joi.string(),
});

async function feedValidation(req, res, next) {
  try {
    await feedSchema.validateAsync({
      text: req.body.text,
      createdBy: req.body.createdBy,
    });
    next();
  } catch (err) {
    return res.status(401).json({message:"" + err});
  }
}
module.exports = feedValidation;
