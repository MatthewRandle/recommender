import React from "react";
import Head from "next/head";

import Footer from "../components/Footer";
import initialSetupFetch from "../utils/initialSetupFetch";
import Navbar from "../components/Navbar";
import { getMovieRecommendations } from "../components/recommendations/duck";

const Index = () => {
    return(
        <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            <Head>
                <title>Find new TV shows and Movies</title>
            </Head>

            <Navbar notFixed />

            <div className="home pushFooter">
                 
            </div>

            <Footer />
        </div>           
    );
};

Index.getInitialProps = async function ({ query, store, req, res }) {
    await initialSetupFetch(store, req);

    const state = store.getState();
    if (state.app && state.app.user) await store.dispatch(getMovieRecommendations(req));

    return { ignore: true };
}

export default Index;