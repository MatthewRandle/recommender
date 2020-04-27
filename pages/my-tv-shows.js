import React from "react";
import Head from "next/head";
import { useSelector } from "react-redux";

import Timeline from "../components/lists/Timeline";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import initialSetupFetch from "../utils/initialSetupFetch";
import { getTVShowList } from "../components/lists/duck";

const MyTvShows = () => {
    return(
        <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            <Head>
                <title>Search for new Movies & TV shows</title>
            </Head>

            <Navbar />

            <div className="list_container pushFooter">
                <div className="list">
                    <Timeline />
                </div>
            </div>

            <Footer />
        </div>
    );
};

MyTvShows.getInitialProps = async function ({ store, req }) {
    await initialSetupFetch(store, req);
    await store.dispatch(getTVShowList(req));
    return { ignore: true };
};

export default MyTvShows;