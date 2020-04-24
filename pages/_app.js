import React from "react";
import App from "next/app";
import { Provider } from "react-redux";
import withRedux from "next-redux-wrapper";
import reduxThunk from "redux-thunk";
import Head from "next/head";
import { createStore, applyMiddleware } from "redux";
import { ToastContainer } from "react-toastify";

import Error from "../components/Error";
import rootReducer from "../utils/rootReducer";

import "../public/empty.css";
import "../stylesheets/css/Footer.css";
import "../stylesheets/css/Navbar.css";
import "../stylesheets/css/Reset.css";

/* if (typeof navigator !== "undefined") {
    require("codemirror/theme/material.css");
} */

const makeStore = (initialState) => {
    return createStore(rootReducer, initialState, applyMiddleware(reduxThunk));
};

class MyApp extends App {
    render() {        
        const { Component, pageProps, store } = this.props;

        return (
            <Provider store={store}>
                <div className="app">
                    <Head>
                        <link href="https://fonts.googleapis.com/css?family=Roboto|Roboto+Slab:700&display=swap" rel="stylesheet" />
                        {/* <link href="https://fonts.googleapis.com/css?family=Roboto+Slab|Zilla+Slab:400,700" rel="stylesheet" />
                        <link rel="canonical" href="https://exportknowledge.com" />
                        <meta name="google-site-verification" content="LvIOdKgCzT_ISjQsQi-NWphkCMSMS4rRmN_cN5qPHUI" /> */}
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                        {/* <title>export Knowledge - Become a full stack web developer for free</title>
                        <meta name="description" content="exort Knowledge is a place where anyone can learn how to become a full stack web developer for free. Including courses of multiple parts and topics that each have a written and video format." /> */}
                    </Head>

                    <Error>                        
                        <Component {...pageProps} />
                    </Error>    

                    <ToastContainer />
                </div>
            </Provider>
        );
    }
}

export default withRedux(makeStore)(MyApp);