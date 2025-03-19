"use client";
import { HiTrash } from "react-icons/hi";
import { useState } from "react";
import ConfirmationWindow from "./ConfirmationWindow";

interface UserInformation {
    firstName: string,
    lastName: string,
    role: string
}

export default function DeleteUserButton(params: UserInformation) {
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
                message={`Are you sure you want to delete ${params.role.toLowerCase()} ${params.firstName} ${params.lastName}?`}
                onClose={closePopup}
                onConfirm={handleConfirm}
            />}
        </div>
    )
}