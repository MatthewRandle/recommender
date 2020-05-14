import React, { useState } from "react";
import { useSelector } from "react-redux";
import Head from "next/head";

import Footer from "../components/Footer";
import initialSetupFetch from "../utils/initialSetupFetch";
import Navbar from "../components/Navbar";
import Item from "../components/recommendations/Item";
import { 
    getMovieRecommendations, 
    getTvShowRecommendations, 
    getTrendingMovies, 
    getTrendingTvShows, 
    getMovieRecommendationsFromActor,
    getTVShowRecommendationsFromActor
} from "../components/recommendations/duck";

const Index = () => {
    const user = useSelector(state => state.app ? state.app.user : null);

    const tvShowRecommendations = useSelector(state => state.recommendations ? state.recommendations.tvShowRecommendations : []);
    const movieRecommendations = useSelector(state => state.recommendations ? state.recommendations.movieRecommendations : []);
    const trendingMovies = useSelector(state => state.recommendations ? state.recommendations.trendingMovies : []);
    const trendingTvShows = useSelector(state => state.recommendations ? state.recommendations.trendingTvShows : []);
    const actorsMovies = useSelector(state => state.recommendations ? state.recommendations.actorsMovies : []);
    const actorForMovieRecommendations = useSelector(state => state.recommendations ? state.recommendations.actorForMovieRecommendations : []);
    const actorShows = useSelector(state => state.recommendations ? state.recommendations.actorShows : []);
    const actorForTVShowRecommendations = useSelector(state => state.recommendations ? state.recommendations.actorForTVShowRecommendations : []);

    const [amountOfTrendingMovies, setAmountOfTrendingMovies] = useState(6);
    const [amountOfTrendingTvShows, setAmountOfTrendingTvShows] = useState(6);
    const [amountOfRecommendedMovies, setAmountOfRecommendedMovies] = useState(6);
    const [amountOfRecommendedTvShows, setAmountOfRecommendedTvShows] = useState(6);

    return(
        <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Head>
                <title>Find new TV shows and Movies</title>
            </Head>

            <Navbar notFixed />

            <div className="home pushFooter">
                {user && movieRecommendations && movieRecommendations.length > 0 ?
                    <div>
                        <h2>Recommended Movies Based On Your Movie List</h2>
                        <section>
                            {movieRecommendations.map((movie, i) => {
                                if (i >= amountOfRecommendedMovies) return;
                                return (
                                    <Item
                                        key={i}
                                        id={movie.movieID}
                                        name={movie.name}
                                        poster_path={movie.poster_path}
                                        vote_average={movie.rating}
                                        type="movie"
                                    />
                                );
                            })}

                            {amountOfRecommendedMovies < 18 && amountOfRecommendedMovies < movieRecommendations.length ? 
                                <button onClick={() => setAmountOfRecommendedMovies(amountOfRecommendedMovies + 6)}>Load More</button> 
                            : null}
                        </section>
                    </div>
                : null}

                {user && tvShowRecommendations && tvShowRecommendations.length > 0 ?
                    <div>
                        <h2>Recommended Movies Based On Your TV Show List</h2>
                        <section>
                            {tvShowRecommendations.map((show, i) => {
                                if (i >= amountOfRecommendedMovies) return;
                                return (
                                    <Item
                                        key={i}
                                        id={show.showID}
                                        name={show.name}
                                        poster_path={show.poster_path}
                                        vote_average={show.rating}
                                        type="tv"
                                    />
                                );
                            })}

                            {amountOfRecommendedTvShows < 18 && amountOfRecommendedTvShows < tvShowRecommendations.length ?
                                <button onClick={() => setAmountOfRecommendedTvShows(amountOfRecommendedTvShows + 6)}>Load More</button>
                            : null}
                        </section>
                    </div>
                : null}

                {user && actorsMovies && actorsMovies.length > 0 ?
                    <div>
                        <h2>Recommended Movies Based On {actorForMovieRecommendations}</h2>
                        <section>
                            {actorsMovies.map((movie, i) => {
                                if (i >= 6) return;
                                return (
                                    <Item
                                        key={i}
                                        id={movie.id}
                                        name={movie.title}
                                        poster_path={movie.poster_path}
                                        vote_average={movie.rating}
                                        type="movie"
                                    />
                                );
                            })}
                        </section>
                    </div>
                : null}

                {user && actorShows && actorShows.length > 0 ?
                    <div>
                        <h2>Recommended Movies Based On {actorForTVShowRecommendations}</h2>
                        <section>
                            {actorShows.map((show, i) => {
                                if (i >= 6) return;
                                return (
                                    <Item
                                        key={i}
                                        id={show.id}
                                        name={show.name}
                                        poster_path={show.poster_path}
                                        vote_average={show.rating}
                                        type="tv"
                                    />
                                );
                            })}
                        </section>
                    </div>
                    : null}

                <h2>Trending Movies</h2>
                <section>
                    {trendingMovies && trendingMovies.length > 0 ?
                        trendingMovies.map((movie, i) => {
                            if (i >= amountOfTrendingMovies) return;
                            return(
                                <Item
                                    key={i}
                                    id={movie.id}
                                    name={movie.title}
                                    poster_path={movie.poster_path}
                                    vote_average={movie.vote_average}
                                    type="movie"
                                />
                            );
                        })
                    : null}

                    {amountOfTrendingMovies < 18 ? <button onClick={() => setAmountOfTrendingMovies(amountOfTrendingMovies + 6)}>Load More</button> : null}
                </section>

                <h2>Trending TV Shows</h2>
                <section>
                    {trendingTvShows && trendingTvShows.length > 0 ?
                        trendingTvShows.map((show, i) => {
                            if (i >= amountOfTrendingTvShows) return;
                            return (
                                <Item
                                    key={i}
                                    id={show.id}
                                    name={show.name}
                                    poster_path={show.poster_path}
                                    vote_average={show.vote_average}
                                    type="tv"
                                />
                            );
                        })
                        : null}

                    {amountOfTrendingTvShows < 18 ? <button onClick={() => setAmountOfTrendingTvShows(amountOfTrendingTvShows + 6)}>Load More</button> : null}
                </section>
            </div>

            <Footer />
        </div>           
    );
};

Index.getInitialProps = async function ({ query, store, req, res }) {
    await initialSetupFetch(store, req);

    let state = store.getState();
    if (state.app && state.app.user) {
        //if the movieRecommends/tv haven't been fetched yet, fetch them
        if (state.recommendations != null) {
            if (state.recommendations.movieRecommendations == null) await store.dispatch(getMovieRecommendations(req));
            if (state.recommendations.tvShowRecommendations == null) await store.dispatch(getTvShowRecommendations(req));
            if (state.recommendations.actorForMovieRecommendations == null) await store.dispatch(getMovieRecommendationsFromActor(req));
            if (state.recommendations.actorForTVShowRecommendations == null) await store.dispatch(getTVShowRecommendationsFromActor(req));
        }
        else {
            await store.dispatch(getMovieRecommendations(req));
            await store.dispatch(getTvShowRecommendations(req));
            await store.dispatch(getMovieRecommendationsFromActor(req));
            await store.dispatch(getTVShowRecommendationsFromActor(req));
        }    
    }

    //if the trending movies/tvShows haven't been fetched yet, fetch them
    if (state.recommendations != null) {
        if (state.recommendations.trendingMovies == null) await store.dispatch(getTrendingMovies());
        if (state.recommendations.trendingTvShows == null) await store.dispatch(getTrendingTvShows());
    }
    else {
        await store.dispatch(getTrendingMovies());
        await store.dispatch(getTrendingTvShows());
    }

    return { ignore: true };
}

export default Index;