import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import prisma from '@/app/lib/database/db'
import { addAppointment, deleteTemporaryAppointment } from '@/app/actions/appointment/db'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
        return NextResponse.redirect('/home/services');
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId)

        if (session.payment_status !== 'paid') {
            return NextResponse.redirect('/home/services');
        }

        const tempAppointmentId = session.metadata?.tempAppointmentId;

        if (!tempAppointmentId) {
            return NextResponse.redirect('/home/services');
        }

        const tempAppointment = await prisma.temporaryAppointment.findUnique({
            where: { id: tempAppointmentId }
        })

        if (!tempAppointment || !tempAppointment.clientId || !tempAppointment.employeeId || !tempAppointment.serviceId) {
            return NextResponse.redirect('/home/services');
        }

        const appt = await addAppointment(tempAppointment.title, tempAppointment.startTime, tempAppointment.endTime, tempAppointment.employeeId, tempAppointment.clientId, tempAppointment.serviceId);

        deleteTemporaryAppointment(tempAppointment.id);

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/home/appointments/${appt.id}`);

    } catch (error) {
        return NextResponse.redirect('/home/services');
    }
}