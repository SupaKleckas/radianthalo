'use server';

import { Appointment, User } from "@prisma/client";
import { format } from "date-fns";
import nodemailer from "nodemailer"

export async function sendAppointmentSuccessEmail(client: User, appt: Appointment) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: process.env.GMAIL_USERNAME,
            pass: process.env.GMAIL_PASSWORD,
        },
    });
    await transporter.sendMail({
        from: process.env.GMAIL_USERNAME,
        to: `${client.email}`,
        subject: `Your appointment at Radiant Halo Lounge`,
        html: `
            <p>Hello ${client.firstName},</p>
            <p>you have succesfully booked <strong>${appt.title}</strong> on ${format(appt.startTime, "MMMM do")}.</p>
            <p>We will see you at ${format(appt.startTime, "HH:mm")}!</p>
            <p>If you are unable to make it to the appointment at the set time, you can reschedule it here <strong>http://localhost:3000/home/appointments/reschedule?id=${appt.id}</strong></p> 
            <p>Best regards,</p>
            <p>Radiant Halo Lounge team</p>
        `,
        replyTo: process.env.GMAIL_USERNAME,
    });
}