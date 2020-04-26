import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { withRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";

import initialSetupFetch from "../../utils/initialSetupFetch";
import forceAuth from "../../utils/forceAuth";
import Navbar from "../../components/Navbar";
import { signUp } from "../../components/auth/duck";
import { putError } from "../../components/app/duck";
import errorHandler from "../../utils/errorHandler";

const SignUp = ({ router }) => {
    const dispatch = useDispatch();
    const origin = router.query ? router.query.origin : null;

    return (
        <div>
            <Head>
                <title>Sign Up to Recommender</title>
            </Head>

            <Navbar />

            <div className="auth">
                <div className="auth_toggles">
                    <h1>Sign up</h1>
                    <Link href="/auth/sign-in"><a>Sign in</a></Link>
                </div>

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
                        passwordVerify: yup
                                .string()
                                .required("Please confirm your password."),
                        name: yup
                            .string()
                            .required("Please enter your name or company name."),
                    })}
                    onSubmit={(values, { setSubmitting }) => {
                        if(values.password !== values.passwordVerify) {
                            return dispatch(errorHandler(null, putError, "Both passwords do not match.", null));
                        }

                        dispatch(signUp(values.name, values.email, values.password, router, origin));
                        setSubmitting(true);
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
                                <label htmlFor="name">Name</label>
                                <Field type="text" name="name" />
                                <ErrorMessage className="auth_error" name="name" component="div" autoComplete="username" />
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
                                <label htmlFor="email">Email</label>
                                <Field type="email" name="email" autoComplete="email" />
                                <ErrorMessage className="auth_error" name="email" component="div" />
                            </div>

                            <label htmlFor="password">Password</label>
                            <Field type="password" name="password" autoComplete="new-password" />
                            <ErrorMessage className="auth_error_password" name="password" component="div" />

                            <label htmlFor="passwordVerify">Verify Password</label>
                            <Field type="password" name="passwordVerify" autoComplete="new-password" />
                            <ErrorMessage name="passwordVerify" component="div" />

                            
                            <p className="auth_legal">
                                I agree to the 
                                <Link href="/terms-of-service"><a target="_blank" rel="noopener noreferrer">Terms of Service</a></Link> 
                                and 
                                <Link href="/privacy-policy"><a target="_blank" rel="noopener noreferrer">Privacy Policy</a></Link>
                            </p>

                            <button type="submit" disabled={isSubmitting}>SIGN UP</button>
                        </Form>
                    )}

                </Formik>
            </div>
        </div>
    );
};

SignUp.getInitialProps = async function ({ store, req, res }) {
    await initialSetupFetch(store, req);

    forceAuth(store, res, false, true, "/dashboard");

    return { ignore: null };
};

export default withRouter(SignUp);