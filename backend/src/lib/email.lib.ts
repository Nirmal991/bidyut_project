import { createTransport } from 'nodemailer';

export const transporter = createTransport({
    service: 'gmail',
    host: process.env.SMTP_HOST,
    // secure: process.env.SMTP_SECURE,
    // port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
})

export const sendMail = async (to: string, subject: string, html: string): Promise<void> => {
    try {
        await transporter.sendMail({
            to,
            html,
            subject: `${subject} - ${process.env.NAME}`,
            from: process.env.SMTP_FROM,
            replyTo: process.env.SMTP_REPLY_TO,
        })
    } catch (error) {
        console.error('Email Lib Send:-', error)
        throw error
    }
}
