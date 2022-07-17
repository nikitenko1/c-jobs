// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
import { Client } from '@sendgrid/client';
import sendgrid from '@sendgrid/mail';
// Test setClient() method
sendgrid.setClient(new Client());

sendgrid.setApiKey(`${process.env.SENDGRID_API_KEY}`);

const sendEmail = async (to, subject, html) => {
  // The error exists as the email address in the "from" field in the message(in your nodejs code,,
  // to be sent using sendgrid) is not verified by sendgrid.
  const options = {
    from: process.env.SENDGRID_VERIFY_SINGLE_SENDER, // Change to your verified sender
    to,
    subject: `Let's work | Kyiv - ${subject}`,
    html,
  };
  try {
    const result = await sendgrid.send(options);
    console.log('Email sent');
    return result;
  } catch (err) {
    console.log(err);
  }
};

export default sendEmail;
