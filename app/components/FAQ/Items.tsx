"use client";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";


interface item {
    value: string,
    question: string,
    content: string
}

export const faqItems: item[] = [
    {
        value: "q1",
        question: "How do I book an appointment?",
        content: "Just sign up to our website and you can book the service you desire in the Services tab!"
    },
    {
        value: "q2",
        question: "Can I reshedule or cancel my appointment?",
        content: "If you cannot make it to your appointment, you can reshedule it at a different date through our website! As for refunds and cancellations, we do not offer that."
    },
    {
        value: "q3",
        question: "Do you accept walk-ins?",
        content: "We do! If there are any free spots available, we can try to fit you right in."
    },
    {
        value: "q4",
        question: "What services do you offer?",
        content: "Take a look at our treatments in the Services tab!"
    },
]

export function FrequentlyAskedQuestions() {
    return (
        <div className="flex w-full m-8 justify-center items-center">
            <Accordion type="multiple" className="bg-slate-300 rounded-2xl p-4 w-full">
                {faqItems.map((item) => (
                    <AccordionItem key={item.value} value={item.value}>
                        <AccordionTrigger className="text-xl md:text-2xl text-slate-800">
                            {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-base md:text-xl text-slate-700">
                            {item.content}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}