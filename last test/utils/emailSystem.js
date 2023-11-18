const nodemailer = require("nodemailer")
    require("dotenv").config()



const sendEmail = (email, subject, html) => {
    
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
        }
    })

    const mailOptions = {

        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html: html
    }


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error)
            return false
        } else {
            console.log(info)
            return true
        }
    })

}

module.exports = sendEmail;