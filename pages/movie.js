import React, { useState } from "react";
import Head from "next/head";
import axios from "axios";
import { useSelector } from "react-redux";
import moment from "moment";

import AddToList from "../components/search/AddToList";
import Footer from "../components/Footer";
import initialSetupFetch from "../utils/initialSetupFetch";
import Navbar from "../components/Navbar";

const Movie = ({ details }) => {
    const user = useSelector(state => state.app ? state.app.user : null);
    const [showAddToList, setShowAddToList] = useState(false);

    return(
        <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Head>
                <title>{details ? details.title : "Movie not found"} - Recommender</title>
            </Head>

            <Navbar notFixed />

            {details ?
                <div className="media pushFooter">
                    {showAddToList ? <AddToList type="movie" details={details} /> : null}

                    <div className="media_content">
                        <div className="media_content_image_container"><img src={"https://image.tmdb.org/t/p/w185/" + details.poster_path} alt="Poster" /></div>
                        <div className="media_text">
                            <h1>{details.title}</h1>
                            <p>{details.overview}</p>

                            <div className="media_text_bottom">
                                <p>Released {moment(details.release_date).format("DD MMMM, YYYY")}</p>
                                {user ? <button onClick={() => setShowAddToList(true)}>Add {details.name} to my Movie list</button> : null}
                            </div>
                        </div>
                    </div>

                    <div className="media_cast_container">
                        <h2>Main Cast</h2>
                        <div className="media_cast">
                            {details.credits && details.credits.cast && details.credits.cast.length > 0 ?
                                details.credits.cast.map((person, i) => (
                                    <div className="media_person" key={i}>
                                        <div className="media_person_image_container"><img src={"https://image.tmdb.org/t/p/w185/" + person.profile_path} alt="Actor Picture" /></div>
                                        <p>{person.name} plays {person.character}</p>
                                    </div>
                                ))
                            : null}
                        </div>
                    </div>
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