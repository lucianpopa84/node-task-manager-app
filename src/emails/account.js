const sgMail = require('@sendgrid/mail');
const sendgridAPIKey = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(sendgridAPIKey);

// sgMail.send({
//     to: 'lucianpopa84@gmail.com',
//     from: 'lucianpopa84@gmail.com',
//     subject: 'This is my first sandgrid mail',
//     text: 'I hope this one actually get to you'
// });

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'lucianpopa84@gmail.com',
        subject: 'Welcome to task manager app',
        text: `Welcome to the app ${name}. Let me know if it is usefull for you.`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'lucianpopa84@gmail.com',
        subject: 'Sorry to see you go',
        text: `Goodbye ${name}. Sorry to see you go, let me know how i can improve my task app.`
    })
}

module.exports = { sendWelcomeEmail, sendCancelationEmail }
