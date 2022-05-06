const Joi = require('joi');

const schema = Joi.object({
  comment: Joi.string().min(5).required()
});
//Joi Validation
async function validateComment(req,res,next) {
   try {
    const {comment}=req.body;
    await schema.validateAsync(
       {comment});
    next();
} catch (err) {
     return res.status(400).json({message:" "+err});
}
}
   module.exports = validateComment;


