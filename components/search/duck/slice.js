import { createSlice } from "@reduxjs/toolkit";

const SearchSlice = createSlice({
    name: "search",
    initialState: null,
    reducers: {
        putResults(state, action) {
            if(state == null) return { ...action.payload };
            state.searchResults = action.payload.searchResults;
        }
    }
});

export const {
    putResults
} = SearchSlice.actions;
export default SearchSlice.reducer;