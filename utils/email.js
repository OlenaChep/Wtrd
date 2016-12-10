"use strict"
//var postmark = require("postmark")(process.env.POSTMARK_API_TOKEN);
const nodemailer = require("nodemailer");
//const mg = require('nodemailer-mailgun-transport');

const Config = require('../config');

//let smtpConfig = 'smtps://elenachepygina%40gmail.com:gtktyf75@smtp.gmail.com';
let smtpConfig = {
    host: 'smtp.mail.yahoo.com',
    port: 465,
    auth: {
        user: Config.email.username,
        pass: Config.email.password
    }
};
/*let auth = {
  auth: {
    api_key: 'key-52b80da945fdd86fb44d3736a66c1fa8',
    domain: 'sandbox5fe1040fadda47a2ba4a9e33396708b9.mailgun.org'
  }
}

let nodemailerMailgun = nodemailer.createTransport(mg(auth));*/


let smtpTransport = nodemailer.createTransport(smtpConfig);

function mail(from, email, subject, mailbody, callback){

    let mailOptions = {
        from: Config.email.username, // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        //text: result.price, // plaintext body
        html: mailbody  // html body
    };
    console.log(email || ' ' || subject || ' ' ||mailbody);
    smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
           console.error(error);
        }
        smtpTransport.close(); // shut down the connection pool, no more messages
        if (callback) {
          callback(error, response);
        }
    });
    /*console.log(email || ' ' || subject || ' ' ||mailbody);
    nodemailerMailgun.sendMail({
       from: 'postmaster@sandbox5fe1040fadda47a2ba4a9e33396708b9.mailgun.org',
         to: email, // An array if you have multiple recipients.
    subject: subject,
       html: mailbody
    }, function (err, info) {
      if (err) {
        console.log('Error: ' + err);
      }
      else {
        console.log('Response: ' + info);
      }
      if (callback) {
        callback(err, info);
      }
    });*/

}

exports.sendMailVerificationLink = function(user, host, token, callback) {
    let host_ = host.indexOf('localhost') >= 0 ? 'http://' + host : 'https://' + host;
    let from = Config.email.accountName + " Team<" + Config.email.username + ">";
    let mailbody = "<p>Спасибо за регистарцию на "+ Config.email.accountName +
      " </p><p>Подтвердите Ваш email, перейдя по ссылке: <br/><a href='" +
      host_ + "/" + Config.email.verifyEmailUrl + "/" + token + "'>Подтверждение Email</a></p>";
    mail(from, user.email, "Верификация регистрации", mailbody, callback);
};

exports.sentMailForgotPassword = function(user, callback) {
    var from = Config.email.accountName+" Team<" + Config.email.username + ">";
    var mailbody = "<p>Your "+Config.email.accountName+"  Account Credential</p><p>username : "+user.userName+" , password : "+decrypt(user.password)+"</p>"
    mail(from, user.userName , "Account password", mailbody);
};
