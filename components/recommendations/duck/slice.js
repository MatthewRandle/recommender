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
        }
    }
});

export const {
    putMovieRecommendations,
    putTvShowRecommendations,
    putTrendingMovies,
    putTrendingTvShows
} = RecommendationSlice.actions;
export default RecommendationSlice.reducer;