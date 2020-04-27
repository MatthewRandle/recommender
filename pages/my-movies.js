import React, { useState } from "react";
import Head from "next/head";
import { useSelector } from "react-redux";

import Timeline from "../components/lists/Timeline";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import initialSetupFetch from "../utils/initialSetupFetch";
import { getMovieList } from "../components/lists/duck";

const MyMovies = () => {
    const movieList = useSelector(state => state.lists ? state.lists.movieList : []);
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
            </Head>

            <Navbar />

            <div className="list_container pushFooter">
                <div className="list">
                    {movieList && movieList.length > 0 ?
                        <Timeline list={movieList} steps={steps} />
                    : 
                        <p>No items on list</p>}
                </div>
            </div>

            <Footer />
        </div>
    );
};

MyMovies.getInitialProps = async function ({ store, req }) {
    await initialSetupFetch(store, req);
    await store.dispatch(getMovieList(req));
    return { ignore: true };
};

export default MyMovies;