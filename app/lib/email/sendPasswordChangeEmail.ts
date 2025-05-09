'use server';

import { User } from "@prisma/client";
import nodemailer from "nodemailer"

export async function sendPasswordChangeEmail(user: User) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: process.env.GMAIL_USERNAME,
            pass: process.env.GMAIL_PASSWORD,
        },
    });

    try {
        await transporter.sendMail({
            from: process.env.GMAIL_USERNAME,
            to: `${user.email}`,
            subject: `Your Password Has Been Updated`,
            html: `
            <p>Hello ${user.firstName},</p>
            <p>we want to inform you that the password for your <strong>Radiant Halo Lounge</strong> account was recently changed.</p>
            <p>If this was not you, please contact support.</p>
            <p>Best regards,</p>
            <p>Radiant Halo Lounge team</p>
        `,
            replyTo: process.env.GMAIL_USERNAME,
        });
        return { success: true };
    } catch {
        return { success: false };
    }
}