import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Router from "next/router";

import { errorNotification } from "./Notifications";

const blacklist = [
    "/embed/comment-section",
    "/embed/sign-in",
    "/embed/sign-up"
];

const ErrorPopup = ({ message, code }) => (
    <div className="notification_error">
        <p className="error_message"><strong>Error:</strong> {message}</p>
        <p className="error_code">{code}</p>
    </div>
)


const Error = ({ children }) => {
    const [enabled, setEnabled] = useState(true);
    const error = useSelector(state => state.app ? state.app.error : null);

    useEffect(() => {
        if (blacklist.indexOf(Router.pathname) !== -1) {
            setEnabled(false);
        }
    }, []);
    
    Router.events.on("routeChangeComplete", (url) => {
        if (blacklist.indexOf(url) !== -1) {
            setEnabled(false);
        }
        else if (!enabled) setEnabled(true);
    })

    

    if (enabled && error && error.fatal) {
        return (
            <div>ERROR MESSAGE</div>
        );
    }
    else if (enabled && error && !error.fatal) {
        errorNotification(<ErrorPopup message={error.message} code={error.code} />);
    }

    return children;
};

export default Error;