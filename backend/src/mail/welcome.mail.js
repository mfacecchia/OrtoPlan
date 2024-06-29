import configureMailingSystem from "./configure.mail.js";
import ejs from 'ejs'
import 'dotenv/config';
import generateEmailVerificationLink from "../auth/verificateEmailAddress.auth.js";


export default async function sendWelcomeEmail(recipient, name, surname){
    const transporter = configureMailingSystem();
    const verificationLink =  await generateEmailVerificationLink(recipient, true);
    let renderedHTMLTemplate = undefined;
    // Rendering HTML templayte with all the data passed as function arguments
    ejs.renderFile(`src/mail/templates/welcome.mail.template.ejs`, {name: name, surname: surname, verificationLink: verificationLink}, (error, htmlStr) => {
        if(error) return false;
        else renderedHTMLTemplate = htmlStr;
    });
    if(!renderedHTMLTemplate) return false;
    return new Promise((resolve, reject) => {
        transporter.sendMail({
            from: `OrtoPlan Mailing System <${process.env.MAILING_SYSTEM_ADDRESS}>`,
            to: recipient,
            subject: "Welcome to OrtoPlan!",
            text: `Welcome to the OrtoPlan family, ${name + ' ' + surname}! Thanks to be a part of our continuously growing family.`,
            html: renderedHTMLTemplate,
            // TODO: Add icons in the backend as well instead of accessing from frontend server
            attachments: [
                {
                    filename: 'favicon.webp',
                    path: `${process.env.FRONTEND_ADDRESS + ':' + process.env.FRONTEND_PORT}/assets/icons/favicon.webp`,
                    cid: 'OrtoPlanLogo'
                },
                {
                    filename: 'footer.webp',
                    path: `${process.env.FRONTEND_ADDRESS + ':' + process.env.FRONTEND_PORT}/assets/icons/footer.webp`,
                    cid: 'OrtoPlanFooterBG'
                }
            ]
        }, (error, info) => {
            // TODO: Reject in case of error, not return
            if(error) return false;
            else return true;
        });
        resolve(true);
    })
}