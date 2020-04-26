import React from "react";
import Head from "next/head";

import Footer from "../components/Footer";
import initialSetupFetch from "../utils/initialSetupFetch";
import Navbar from "../components/Navbar";

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

    return { ignore: true };
}

export default Index;