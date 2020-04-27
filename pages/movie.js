import React from "react";
import Head from "next/head";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";

import Footer from "../components/Footer";
import initialSetupFetch from "../utils/initialSetupFetch";
import Navbar from "../components/Navbar";
import { addMovieToList } from "../components/lists/duck";

const Movie = ({ details }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.app ? state.app.user : null);

    return(
        <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            <Head>
                <title>{details ? details.name : "Show not found"} - Recommender</title>
            </Head>

            <Navbar notFixed />

            {details ?
                <div className="media pushFooter">
                    {user ? <button onClick={() => dispatch(addMovieToList(details, "9.1"))}>Add {details.name} to my Movie list</button> : null}

                    <h1>{details.name}</h1>
                    <p>{details.overview}</p>
                    <img src={"http://image.tmdb.org/t/p/w185/" + details.poster_path} alt="Poster" />

                    <h2>Main Cast</h2>
                    {details.credits && details.credits.cast && details.credits.cast.length > 0 ?
                        details.credits.cast.map((person, i) => (
                            <div key={i}>
                                <p>{person.name}</p>
                            </div>
                        ))
                    : null}
                </div>
            : 
                <div>
                    <h1>Sorry, we could not find the specified TV Show.</h1>
                </div>
            }

            <Footer />
        </div>     
    );
};

Movie.getInitialProps = async function ({ query, store, req, res }) {
    await initialSetupFetch(store, req);

    const { id } = query;

    const movieLink = `https://api.themoviedb.org/3/movie/${id}?api_key=abed60834d8a74d3044fac789f6c7c07&language=en-US&append_to_response=credits`;
    const details = await axios.get(movieLink);

    return { details: details.data };
}

export default Movie;