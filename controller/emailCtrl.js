const nodemailer = require("nodemailer");
const asyncHandler = require('express-async-handler')

//? data contain (to, from, subject, information)
const sendEmail = asyncHandler(async (data, req, res) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_ID,
            pass: process.env.MAIL_PASSWORD
        }
    });

    async function main() {
        const info = await transporter.sendMail({
            from: '"Fred Foo 👻 yadav11adu@gmail.com',
            to: data.to,
            subject: data.subject,
            text: data.text,
            html: data.html,
        });

        console.log("Message sent: %s", info.messageId);
    }

    main().catch(console.error);
})

module.exports = sendEmail