'use server';

import { Appointment, User } from "@prisma/client";
import { format } from "date-fns";
import nodemailer from "nodemailer"

export async function sendRescheduleSuccessEmail(client: User, appt: Appointment) {
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
            subject: `Your appointment was rescheduled!`,
            html: `
            <p>Hello ${client.firstName},</p>
            <p>you have succesfully rescheduled your <strong>${appt.title}</strong> appointment!</p>
            <p>Your appointment will now happen at ${format(appt.startTime, "MMMM do, HH:mm")}.</p>
            <p>We'll see you then!</p>
            <p>Best regards,</p>
            <p>Radiant Halo Lounge team</p>
        `,
            replyTo: process.env.GMAIL_USERNAME,
        });
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false };
    }
}