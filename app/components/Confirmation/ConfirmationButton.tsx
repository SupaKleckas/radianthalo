"use client";
import { HiTrash } from "react-icons/hi";
import { useState } from "react";
import ConfirmationWindow from "@/app/components/Confirmation/ConfirmationWindow";

interface Message {
    message: string
}

export default function ConfirmationButton(params: Message) {
    const [popupOpen, setPopupOpen] = useState(false);

    const openPopup = (e: React.MouseEvent) => {
        e.preventDefault();
        setPopupOpen(true);
    };

    const closePopup = () => {
        setPopupOpen(false);
    };

    const handleConfirm = () => {
        const form = document.querySelector("form");
        form?.requestSubmit();
        setPopupOpen(false);
    };

    return (
        <div>
            <button type="button" onClick={openPopup} className="mr-4 hover:text-red-500">
                <HiTrash className='text-2xl hover:cursor-pointer' />
            </button>
            {popupOpen && <ConfirmationWindow
                message={params.message}
                onClose={closePopup}
                onConfirm={handleConfirm}
            />}
        </div>
    )
}