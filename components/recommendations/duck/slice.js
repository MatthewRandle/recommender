import { createSlice } from "@reduxjs/toolkit";

const RecommendationSlice = createSlice({
    name: "recommendations",
    initialState: null,
    reducers: {
        putResults(state, action) {
            if(state == null) return { ...action.payload };
            state.searchResults = action.payload.searchResults;
        }
    }
});

export const {
    
} = RecommendationSlice.actions;
export default RecommendationSlice.reducer;