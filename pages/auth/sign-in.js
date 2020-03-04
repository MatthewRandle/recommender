import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { withRouter } from "next/router";

import initialSetupFetch from "../../utils/initialSetupFetch";
import forceAuth from "../../utils/forceAuth";
import { signIn } from "../../components/auth/duck";

const SignIn = ({ router, origin }) => {
    const dispatch = useDispatch();
    
    return (
        <div>
            <Formik
                initialValues={{ email: "", password: "" }}
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
                        )
                })}
                onSubmit={(values, { setSubmitting }) => {
                    dispatch(signIn(values.email, values.password, router, origin));
                    setSubmitting(true);
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <label htmlFor="email">Email</label>
                        <Field type="email" name="email" autoComplete="email" />
                        <ErrorMessage name="email" component="div" />

                        <label htmlFor="password">Password</label>
                        <Field type="password" name="password" autoComplete="new-password" />
                        <ErrorMessage name="password" component="div" />

                        <button type="submit" disabled={isSubmitting}>Sign In</button>
                    </Form>
                )}

            </Formik>
        </div>
    );
};

SignIn.getInitialProps = async function ({ store, req, res, query }) {
    await initialSetupFetch(store, req);

    forceAuth(store, res, false);
    
    if(query) return { origin: query.origin };
    else return { ignore: null };
};

export default withRouter(SignIn);