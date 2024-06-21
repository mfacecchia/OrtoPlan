import nodemailer from 'nodemailer';
import 'dotenv/config';


export default function configureMailingSystem(){
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        secure: true,
        auth: {
            user: process.env.MAILING_SYSTEM_ADDRESS,
            pass: process.env.MAILING_SYSTEM_PASSWORD
        }
    });
    transporter.verify((error, success) => {
        if(error){
            console.log(error);
            return false;
        }
        else{
            console.log("Ready to send email");
            return transporter;
        }
    });
}
