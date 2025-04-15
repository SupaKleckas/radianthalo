"use client";

import React, { useEffect, useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { convertToCent } from "@/app/lib/payments/convertToCent";

interface Params {
    amount: number
}

export default function Page({ amount }: Params) {
    const stripe = useStripe();
    const elements = useElements();

    const [errorMsg, setErrorMsg] = useState<string>();
    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch("api/create-payment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount: convertToCent(amount) })
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret))
    }, [amount])


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {

    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-md p-2">
            {clientSecret && <PaymentElement />}
            {errorMsg && <div>{errorMsg}</div>}
        </form>
    )
}