import React, { useState } from "react";
import Head from "next/head";
import { useSelector } from "react-redux";

import Timeline from "../components/lists/Timeline";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import initialSetupFetch from "../utils/initialSetupFetch";
import forceAuth from "../utils/forceAuth";
import { getTVShowList, updateTVShowRating } from "../components/lists/duck";
import { deleteTVShowFromList } from "../components/lists/duck";

const MyTvShows = () => {
    const tvShowList = useSelector(state => state.lists ? state.lists.tvShowList : []);
    const [steps, setSteps] = useState([
        "10",
        "9",
        "8",
        "7",
        "6",
        "5",
        "4",
        "3",
        "2",
        "1",
        "0"
    ]);

    return(
        <div>
            <Head>
                <title>Search for new Movies & TV shows</title>
                <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@700&display=swap" rel="stylesheet"></link>
            </Head>

            <Navbar />

            <div className="list_container pushFooter">
                <div className="list">
                    <Timeline updateMedia={updateTVShowRating} deleteMedia={deleteTVShowFromList} list={tvShowList} steps={steps} />
                </div>
            </div>

            <Footer />
        </div>
    );
};

MyTvShows.getInitialProps = async function ({ store, req, res }) {
    await initialSetupFetch(store, req);
    
    if (forceAuth(store, res, true, false) === true) {
        await store.dispatch(getTVShowList(req));
    }
    
    return { ignore: true };
};

export default MyTvShows;