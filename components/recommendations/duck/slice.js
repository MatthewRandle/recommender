import { createSlice } from "@reduxjs/toolkit";

const RecommendationSlice = createSlice({
    name: "recommendations",
    initialState: null,
    reducers: {
        putMovieRecommendations(state, action) {
            if(state == null) return { ...action.payload };
            state.movieRecommendations = action.payload.movieRecommendations;
        },
        putTvShowRecommendations(state, action) {
            if (state == null) return { ...action.payload };
            state.tvShowRecommendations = action.payload.tvShowRecommendations;
        },
        putTrendingMovies(state, action) {
            if (state == null) return { ...action.payload };
            state.trendingMovies = action.payload.trendingMovies;
        },
        putTrendingTvShows(state, action) {
            if (state == null) return { ...action.payload };
            state.trendingTvShows = action.payload.trendingTvShows;
        },
        putActorsMovies(state, action) {
            if (state == null) return { ...action.payload };
            state.actorsMovies = action.payload.actorsMovies;
            state.actorForMovieRecommendations = action.payload.actorForMovieRecommendations;
        },
        putActorsShows(state, action) {
            if (state == null) return { ...action.payload };
            state.actorShows = action.payload.actorShows;
            state.actorForTVShowRecommendations = action.payload.actorForTVShowRecommendations;
        },
        putGenreMovies(state, action) {
            if (state == null) return { ...action.payload };
            state.genreMovies = action.payload.genreMovies;
            state.genreForMovieRecommendations = action.payload.genreForMovieRecommendations;
        }
    }
});

export const {
    putMovieRecommendations,
    putTvShowRecommendations,
    putTrendingMovies,
    putTrendingTvShows,
    putActorsMovies,
    putActorsShows,
    putGenreMovies
} = RecommendationSlice.actions;
export default RecommendationSlice.reducer;