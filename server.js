import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

// Read the hidden credentials file (.env)
dotenv.config();

const app = express();
const PORT = 5000; 

// Allow data to transfer smoothly between your frontend layout and backend server
app.use(cors());
app.use(express.json());

// The automated pathway that your contact form will trigger
app.post('/api/inquiry', async (req, res) => {
    const { name, email, message } = req.body;

    // 1. Setup email portal using Gmail configurations
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS  
        }
    });

    // 2. Draft the layout sent directly to your agency emails
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'agwlmsomil@gmail.com, chaitiagar@gmail.com', // Automatically routes to both inbox accounts [cite: 10, 12]
        subject: `MTA Sourcing Inquiry from ${name}`,
        html: `
            <h3>New Sourcing Inquiry Received</h3>
            <p><strong>Client Name:</strong> ${name}</p>
            <p><strong>Client Email:</strong> ${email}</p>
            <p><strong>Message/Requirements:</strong></p>
            <p>${message}</p>
        `
    };

    // 3. Fire the email safely
    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: "Inquiry sent successfully!" });
    } catch (error) {
        console.error("NodeMailer Error Log:", error);
        res.status(500).json({ success: false, message: "Failed to deliver email message." });
    }
});

app.listen(PORT, () => {
    console.log(`Node.js backend server is running smoothly on http://localhost:${PORT}`);
});