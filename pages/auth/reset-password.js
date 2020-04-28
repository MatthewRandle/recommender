import React, { useState } from "react";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Head from "next/head";

import { sendResetPasswordEmail } from "../../components/auth/duck";
import Navbar from "../../components/Navbar";

const ResetPassword = () => {
    const dispatch = useDispatch();

    const [success, setSuccess] = useState(false);

    return(
        <div>
            <Head>
                <title>Reset Password - Commenze</title>
            </Head>

            <Navbar />

            <div className="auth">
                <img src="/Logo.svg" alt="Commenze" />
                <Formik
                    initialValues={{ email: "" }}
                    validationSchema={yup.object().shape({
                        email: yup
                            .string().email().required("Please input your email.")
                    })}
                    onSubmit={(values, { setSubmitting }) => {
                        dispatch(sendResetPasswordEmail(values.email, setSuccess, setSubmitting));

                        setSubmitting(true);
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            {success ? <p className="auth_success">Email sent, check your inbox within the next few minutes.</p> : null}

                            <label htmlFor="email">Email</label>
                            <Field type="email" name="email" />
                            <ErrorMessage name="email" component="div" />

                            <button type="submit" disabled={isSubmitting} className="auth_button_longText">SEND VERIFICATION EMAIL</button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default ResetPassword;