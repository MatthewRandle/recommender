import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { withRouter } from "next/router";

import initialSetupFetch from "../../utils/initialSetupFetch";
import forceAuth from "../../utils/forceAuth";
import { signUp } from "../../components/auth/duck";

const SignUp = ({ router }) => {
    const dispatch = useDispatch();
    const origin = router.query ? router.query.origin : null;

    return (
        <div>
            <Formik
                initialValues={{ email: "", password: "", name: "" }}
                validationSchema={yup.object().shape({
                    email: yup
                        .string().email().lowercase()
                        .required("Email is required."),
                    password: yup
                        .string()
                        .required("Password is required.")
                        .matches(
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                            "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case character."
                        ),
                    name: yup
                        .string()
                        .required("Please enter your name or company name."),
                })}
                onSubmit={(values, { setSubmitting }) => {
                    dispatch(signUp(values.name, values.email, values.password, router, origin));
                    setSubmitting(true);
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <label htmlFor="name">Name</label>
                        <Field type="text" name="name" />
                        <ErrorMessage name="name" component="div" autoComplete="username" />

                        <label htmlFor="email">Email</label>
                        <Field type="email" name="email" autoComplete="email" />
                        <ErrorMessage name="email" component="div" />

                        <label htmlFor="password">Password</label>
                        <Field type="password" name="password" autoComplete="new-password" />
                        <ErrorMessage name="password" component="div" />

                        <button type="submit" disabled={isSubmitting}>Sign Up</button>
                    </Form>
                )}

            </Formik>
        </div>
    );
};

SignUp.getInitialProps = async function ({ store, req, res }) {
    await initialSetupFetch(store, req);

    forceAuth(store, res, false);

    return {};
};

export default withRouter(SignUp);