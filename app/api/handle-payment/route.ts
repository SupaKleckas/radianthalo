"use server";
import { NextResponse } from 'next/server'
import { stripe } from '@/app/lib/stripe/stripe'
import prisma from '@/app/lib/database/db'
import { addAppointment, deleteTemporaryAppointment, doesApptExist } from '@/app/actions/appointment/db'
import { PaymentMethod } from '@prisma/client'
import { sendAppointmentSuccessEmail } from '@/app/lib/email/sendAppointmentSuccessEmail';
import { getUserById } from '@/app/actions/user/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/home/services`);
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId)

        if (session.payment_status !== 'paid') {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/home/services`);
        }

        const tempAppointmentId = session.metadata?.tempAppointmentId;

        if (!tempAppointmentId) {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/home/services`);
        }

        const tempAppointment = await prisma.temporaryAppointment.findUnique({
            where: { id: tempAppointmentId }
        })

        if (!tempAppointment || !tempAppointment.clientId || !tempAppointment.employeeId || !tempAppointment.serviceId) {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/home/services`);
        }

        const user = await getUserById(tempAppointment.clientId);

        if (!user) {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/home/services`);
        }

        deleteTemporaryAppointment(tempAppointment.id);

        const duplicateExists = await doesApptExist(tempAppointment.employeeId, tempAppointment.startTime, tempAppointment.endTime);

        const appt = await addAppointment(tempAppointment.title, tempAppointment.startTime, tempAppointment.endTime, tempAppointment.employeeId, tempAppointment.clientId, tempAppointment.serviceId, PaymentMethod.Online);

        if (duplicateExists) {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/home/appointments/reschedule?id=${appt.id}`);
        }

        await sendAppointmentSuccessEmail(user, appt);

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/home/appointments/${appt.id}`);

    } catch {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/home/services`);
    }
}