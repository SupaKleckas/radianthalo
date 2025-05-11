'use server';

import { Client, User } from "@prisma/client";
import nodemailer from "nodemailer"

interface AppointmentWithRelations {
    id: string;
    title: string;
    startTime: Date;
    endTime: Date;
    employeeId: string | null;
    clientId: string | null;
    serviceId: string | null;
    client: (Client & {
        user: {
            email: string,
            firstName: string,
            lastName: string,
        }
    }) | null;
}

export async function sendTimeOffAnnounement(appts: AppointmentWithRelations[], employee: User) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: process.env.GMAIL_USERNAME,
            pass: process.env.GMAIL_PASSWORD,
        },
    });

    for (const appt of appts) {
        if (!appt.client) {
            continue
        }
        await transporter.sendMail({
            from: process.env.GMAIL_USERNAME,
            to: `${appt.client.user.email}`,
            subject: `Your appointment service provider is not available`,
            html: `
                <p>Hello ${appt.client.user.firstName},</p>
                <p>Unfortunately, service provider ${employee.firstName} you have booked will be unavailable during the time of the appointment.</p>
                <p>Please kindly reschedule your appointment or change the service provider. You can do so here: ${process.env.NEXT_PUBLIC_BASE_URL}/home/appointments/reschedule?id=${appt.id}</p>
                <p>We apologise for the inconvenience.</p>
                <p>Best regards,</p>
                <p>Radiant Halo Lounge team</p>
            `,
            replyTo: process.env.GMAIL_USERNAME,
        });
    }
}