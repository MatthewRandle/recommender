import React from "react";
import Head from "next/head";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";

import Footer from "../components/Footer";
import initialSetupFetch from "../utils/initialSetupFetch";
import Navbar from "../components/Navbar";
import { addTvShowToList } from "../components/lists/duck";

const TV = ({ details }) => {
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
                    {user ? <button onClick={() => dispatch(addTvShowToList(details, "9.1"))}>Add {details.name} to my TV Show list</button> : null}

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

TV.getInitialProps = async function ({ query, store, req, res }) {
    await initialSetupFetch(store, req);

    const { id } = query;

    const tvLink = `https://api.themoviedb.org/3/tv/${id}?api_key=abed60834d8a74d3044fac789f6c7c07&language=en-US&append_to_response=credits`;
    const details = await axios.get(tvLink);

    if(details && details.data) {
        const amountOfSeasons = details.data.seasons ? details.data.seasons.length : 0;

        if(amountOfSeasons > 0) {
            for(let i = 1; i < amountOfSeasons; i++) {
                const creditsLink = `https://api.themoviedb.org/3/tv/${id}/season/${i}/credits?api_key=abed60834d8a74d3044fac789f6c7c07&language=en-US`;
                const credits = await axios.get(creditsLink);

                if (credits && credits.data) details.data.credits.cast.push(...credits.data.cast);
            }
        }
        
        //once we have all the cast throughout all the seasons, filter them too remove duplicates
        details.data.credits.cast = details.data.credits.cast.filter((item, i, self) => i === self.findIndex(t => t.id === item.id));
    }

    return { details: details.data };
}

export default TV;