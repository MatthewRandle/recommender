import React from "react";
import App from "next/app";
import { Provider } from "react-redux";
import withRedux from "next-redux-wrapper";
import reduxThunk from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import { ToastContainer } from "react-toastify";
import Head from "next/head";

import Error from "../components/Error";
import rootReducer from "../utils/rootReducer";

import "../stylesheets/css/AddToList.css";
import "../stylesheets/css/Auth.css";
import "../stylesheets/css/ConfirmAlert.css";
import "../stylesheets/css/Footer.css";
import "../stylesheets/css/Index.css";
import "../stylesheets/css/List.css";
import "../stylesheets/css/Media.css";
import "../stylesheets/css/Navbar.css";
import "../stylesheets/css/Notifications.css";
import "react-toastify/dist/ReactToastify.css";
import "../stylesheets/css/Reset.css";
import "../stylesheets/css/Search.css";
import "../stylesheets/css/Timeline.css";

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
                        <link href="https://fonts.googleapis.com/css?family=Roboto|Roboto+Slab:800&display=swap" rel="stylesheet" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1" />
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