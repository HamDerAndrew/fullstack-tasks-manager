const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SEND_GRID_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'andrewsondergaard@gmail.com',
        subject: 'Welcome and thanks for joining',
        text: `Welcome to the platform ${name}. Glad to have you here!`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'andrewsondergaard@gmail.com',
        subject: 'Cancelation confirmed. Sorry to see you go',
        text: `Hi ${name}. Your cancelation has been completed. Sorry to see you go.
        Feel free to write us about why you left`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}