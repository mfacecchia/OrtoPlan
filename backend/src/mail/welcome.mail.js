import configureMailingSystem from "./configure.mail.js";
import ejs from 'ejs'
import 'dotenv/config';


export default function sendWelcomeEmail(recipient, name, surname){
    const transporter = configureMailingSystem();
    let renderedHTMLTemplate = undefined;
    // Rendering HTML templayte with all the data passed as function arguments
    ejs.renderFile(`src/mail/templates/welcome.mail.template.ejs`, {name: name, surname: surname}, (error, htmlStr) => {
        if(error) return false;
        else renderedHTMLTemplate = htmlStr;
    });
    if(!renderedHTMLTemplate) return false;
    transporter.sendMail({
        from: `OrtoPlan Mailing System <${process.env.MAILING_SYSTEM_ADDRESS}>`,
        to: recipient,
        subject: "Welcome to OrtoPlan!",
        text: `Welcome to the OrtoPlan family, ${name + ' ' + surname}! Thanks to be a part of our continuously growing family.`,
        html: renderedHTMLTemplate,
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
        if(error) return false;
        else return true;
    });
}