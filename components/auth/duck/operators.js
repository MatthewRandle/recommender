import axios from "axios";

import { putError, putUser } from "../../app/duck";
import errorHandler from "../../../utils/errorHandler";

export const signUp = (name, email, password, router, origin) => async dispatch => {
    try {
        const res = await axios.post("/auth/sign-up", { name, email, password });
        dispatch(putUser({ user: res.data.user }))

        if (origin) router.push(origin);
        else router.push("/");
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
        dispatch(putUser({ user: res.data.user }))
        
        if (origin) router.push(origin);
        else router.push("/");
    }
    catch (err) {
        dispatch(errorHandler(
            err,
            putError,
            "There was a problem signing you in. Please try again.",
            "ERR_SIGN_IN_ERROR",
            false
        ));
    }
};