import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,           // dùng SSL
    secure: true,        // true = SSL, false = STARTTLS
    auth: {
        user: process.env.EMAIL_USER, // Gmail của bạn
        pass: process.env.EMAIL_PASS, // App Password (16 ký tự)
    },
});

export const sendMail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"My App" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });

        console.log("✅ Email sent:", info.messageId);
        return info;
    } catch (err) {
        console.error("❌ Error sending email:", err);
        throw err;
    }
};
