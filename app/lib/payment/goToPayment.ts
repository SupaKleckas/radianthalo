"use server";
import { stripe } from "@/lib/stripe"
import { User, Service } from "@prisma/client";
import { addTemporaryAppointmentByBooking } from "@/app/actions/appointment/actions";
import { redirect } from "next/navigation";

export async function goToPayment(employee: User, date: Date, time: string, service: Service, timeZone: string) {
    const serviceStripe = {
        price_data: {
            currency: "EUR",
            product_data: { name: service.title },
            unit_amount: Math.round(service.price * 100)
        },
        quantity: 1
    }

    const tempAppointment = await addTemporaryAppointmentByBooking(employee, date, time, service, timeZone);

    if (!tempAppointment) {
        redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/home/services`);
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [serviceStripe],
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/handle-payment?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/home/services`,
        metadata: {
            tempAppointmentId: tempAppointment.id
        }
    });

    return { redirectUrl: session.url };
}