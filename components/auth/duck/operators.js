import axios from "axios";

import { putError, putUser } from "../../app/duck";
import errorHandler from "../../../utils/errorHandler";

export const signUp = (name, email, password, router, origin) => async dispatch => {
    try {
        const res = await axios.post("/auth/sign-up", { name, email, password });
        dispatch(putUser({ user: res.data.user }));

        router.push("/").then(() => window.scrollTo(0, 0));
    }
    catch (err) {
        dispatch(errorHandler(
            err,
            putError,
            "There was a problem signing you up. Please try again.",
            "ERR_SIGN_UP_ERROR",
            false
        ));
    }
};

export const signIn = (email, password, router, origin) => async dispatch => {
    try {
        const res = await axios.post("/auth/sign-in", { email, password });
        dispatch(putUser({ user: res.data.user }));

        if (origin) router.push(origin).then(() => window.scrollTo(0, 0));
        else router.push("/").then(() => window.scrollTo(0, 0));
    }
    catch (err) {
        dispatch(errorHandler(
            err,
            putError,
            "There was a problem signing you in. Please try again.",
            "ERR_SIGN_IN_ERROR",
            false
        ));

        return false;
    }
};

export const sendResetPasswordEmail = (email, setSuccess, setSubmitting) => async dispatch => {
    try {
        await axios.post("/email/reset-password", { email });
        setSuccess(true);
        setSubmitting(false);
    }
    catch (err) {
        dispatch(errorHandler(
            err,
            putError,
            "There was a problem sending the email. Please try again later.",
            "ERR_RESET_PASSWORD_EMAIL_FAILURE",
            false
        ));

        return false;
    }
};

export const resetPassword = (code, password, router) => async dispatch => {
    try {
        await axios.post("/verification/reset-password", { code, password });
        router.push("/auth/sign-in").then(() => window.scrollTo(0, 0));
    }
    catch (err) {
        dispatch(errorHandler(
            err,
            putError,
            "There was a problem resetting your password. Please try again later.",
            "ERR_RESET_PASSWORD_FAILURE",
            false
        ));

        return false;
    }
};