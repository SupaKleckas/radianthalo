'use server';

import { Appointment, User } from "@prisma/client";
import nodemailer from "nodemailer"

export async function sendCancelSuccessEmail(client: User, appt: Appointment) {
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
            subject: `Your appointment was cancelled`,
            html: `
            <p>Hello ${client.firstName},</p>
            <p>you have succesfully cancelled your <strong>${appt.title}</strong> appointment.</p>
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