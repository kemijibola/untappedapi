const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const keys = require('../config/keys');

let send = async args => {
    const oauth2Client = new OAuth2(
        keys.googoleClient.clientId,
        keys.googoleClient.clientSecret, // Client Secret
        "https://developers.google.com/oauthplayground" // Redirect URL
   );
    oauth2Client.setCredentials({
        refresh_token: keys.googoleClient.refreshToken
    });
    const tokens = await oauth2Client.refreshAccessTokenAsync()
    const accessToken = tokens.credentials.access_token

    let transporter = nodemailer;
    try {
        // create reusable transporter object using the default SMTP transport
            transporter = nodemailer.createTransport({
            // host: "smtp.ethereal.email",
            // port: 587,
            // secure: false, // true for 465, false for other ports
            // auth: {
            // user: testAccount.user, 
            // pass: testAccount.pass
            // }
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "kemijibbola@gmail.com", 
                clientId: keys.googoleClient.clientId,
                clientSecret: keys.googoleClient.clientSecret,
                refreshToken: keys.googoleClient.refreshToken,
                accessToken: accessToken
            }
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: args.senders_email, // sender address
            to: args.receiver_email, // list of receivers
            subject: args.subject, // Subject line
            html: args.body // html body
        });
        
        console.log(info)
        transporter.close()

    } catch (err) {
        transporter.close()
        console.log(`Error: ${err}`);
    }
};

module.exports = {
 send
};