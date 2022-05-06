const res = require('express/lib/response');
var nodemailer = require('nodemailer');
async function mailGenerator(email,otp){
 try{
var transporter = nodemailer.createTransport({
  service: 'gmail',
  post:587,
  secure:false,
  auth: {
    user: 'letschatwithbuzz@gmail.com',
    pass: 'BUZZ747477@'
  }
});
  var mailOptions = {
  from: 'letschatwithbuzz@gmail.com',
  to: email,
  subject: 'Password reset mail',
  text: `Find below the otp for reseting password ${otp}`
};
 const info=await transporter.sendMail(mailOptions);
 return true;}
 catch(err){
  return false;
}
}
module.exports=mailGenerator;
