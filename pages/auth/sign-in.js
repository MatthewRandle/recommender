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
import { signIn } from "../../components/auth/duck";

const SignIn = ({ router, origin }) => {
    const dispatch = useDispatch();
    
    return (
        <div>
            <Head>
                <title>Sign into Recommender</title>
            </Head>

            <Navbar />

            <div className="auth">
                <div className="auth_toggles">
                    <h1>Sign in</h1>
                    <Link href="/auth/sign-up"><a>Sign up</a></Link>
                </div>

                <Formik
                    initialValues={{ email: "", password: "" }}
                    validationSchema={yup.object().shape({
                        email: yup
                            .string().email().lowercase()
                            .required("Email is required."),
                        password: yup
                            .string()
                            .required("Password is required.")
                    })}
                    onSubmit={(values, { setSubmitting }) => {
                        dispatch(signIn(values.email, values.password, router, origin))
                        .then(res => {
                            setSubmitting(res);
                        });
                        setSubmitting(true);
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
                                <label htmlFor="email">Email</label>
                                <Field type="email" name="email" autoComplete="email" />
                                <ErrorMessage className="auth_error" name="email" component="div" />
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
                                <label htmlFor="password">Password</label>
                                <Field type="password" name="password" autoComplete="new-password" />
                                <ErrorMessage className="auth_error" name="password" component="div" />
                            </div>                            

                            <Link href="/auth/reset-password"><a>Forgot your password?</a></Link>

                            <button type="submit" disabled={isSubmitting}>SIGN IN</button>
                        </Form>
                    )}

                </Formik>
            </div>
        </div>
    );
};

SignIn.getInitialProps = async function ({ store, req, res, query }) {
    await initialSetupFetch(store, req);

    forceAuth(store, res, false, true, "/dashboard");
    
    if(query) return { origin: query.origin };
    else return { ignore: null };
};

export default withRouter(SignIn);