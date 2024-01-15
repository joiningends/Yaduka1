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

module.exports = { sendPasswordByEmail };
