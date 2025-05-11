'use server';

import { User } from "@prisma/client";
import nodemailer from "nodemailer"

export async function sendRegistrationSuccessEmail(client: User) {
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
            to: `${client.email}`,
            subject: `You have succesfully registered at Radiant Halo Lounge!`,
            html: `
            <p>Hello ${client.firstName},</p>
            <p>you have succesfully registered at Radiant Halo Lounge!</p>
            <p>When you're ready, book an appointment here ${process.env.NEXT_PUBLIC_BASE_URL}/home/services</p>
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