const nodemailer = require('nodemailer');

// Function to send the password to the user's email
async function sendPasswordByEmail(email, password) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: 'inspiron434580@gmail.com',
            pass: 'rogiprjtijqxyedm',
        },
    });

    const mailOptions = {
        from: 'inspiron434580@gmail.com',
        to: email,
        subject: 'login credential',
        text: `Your password is: ${password}`,
    };

    await transporter.sendMail(mailOptions);
}

async function sendnotificationByEmail(email,text ) {
    console.log(email)
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: 'joiningends93@gmail.com',
            pass: 'phxq dgpu etkz afuu',
        },
    });

    const mailOptions = {
        from: 'joiningends93@gmail.com',
        to: email,
        subject: 'Update the delivery qty',
        text: text,
    };

    await transporter.sendMail(mailOptions);
}

module.exports = { sendPasswordByEmail,sendnotificationByEmail };
