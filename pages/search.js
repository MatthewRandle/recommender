import React, { useState } from "react";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import initialSetupFetch from "../utils/initialSetupFetch";
import { search } from "../components/search/duck";
import Result from "../components/search/Result";

const Search = () => {
    const dispatch = useDispatch();
    const [typingTimeout, setTypingTimeout] = useState(0);
    const searchResults = useSelector(state => state.search ? state.search.searchResults : []);

    const handleChange = (event) => {
        const query = event.target.value;

        clearTimeout(typingTimeout);

        setTypingTimeout(setTimeout(() => {
            dispatch(search(query));
        }, 1000));
    }

    return(
        <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Head>
                <title>Search for new Movies & TV shows</title>
            </Head>

            <Navbar />

            <div className="search pushFooter">
                <div className="search_form">
                    <label htmlFor="search"><h1>Search for a Movie or TV Show</h1></label>
                    <input autoComplete="off" onChange={handleChange} type="text" name="search" />

                    {searchResults && searchResults.length > 0 ?
                        searchResults.map((result, i) => {
                            if (result.media_type !== "movie" && result.media_type !== "tv") return;

                            return(
                                <Result
                                    key={i}
                                    id={result.id}
                                    title={result.original_name || result.original_title}
                                    posterPath={result.poster_path}
                                    type={result.media_type}
                                    overview={result.overview.substring(0, 200)}
                                />
                            );
                        })
                    : null}
                </div>
            </div>

            <Footer />
        </div>
    );
};

Search.getInitialProps = async function ({ query, store, req, res }) {
    await initialSetupFetch(store, req);

    return { ignore: true };
};

export default Search;