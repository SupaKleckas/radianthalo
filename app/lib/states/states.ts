export type EditPasswordState = {
    _errors?: {
        newPassword?: string[],
        confirmPassword?: string[]
    }
};

export type EditAccountState = {
    _errors?: {
        firstName?: string[],
        lastName?: string[],
        email?: string[]
    }
};

export type AddUserFormState = {
    _errors?: {
        email?: string[],
        password?: string[],
        firstname?: string[],
        lastname?: string[],
        role?: string[]
    }
};

export type EditUserFormState = {
    _errors?: {
        email?: string[],
        firstname?: string[],
        lastname?: string[],
        role?: string[]
    }
};

export type SignupFormState = {
    _errors?: {
        email?: string[],
        firstname?: string[],
        lastname?: string[],
        password?: string[]
    }
};

export type LoginFormState = {
    _errors?: {
        email?: string[],
        password?: string[]
    }
};

export type AddServiceFormState = {
    _errors?: {
        title?: string[],
        price?: string[],
        duration?: string[],
        employees?: string[]
    }
};

export type EditServiceFormState = {
    _errors?: {
        title?: string[],
        price?: string[],
        duration?: string[],
        employees?: string[]
    }
};