import { createSlice } from "@reduxjs/toolkit";

const ListsSlice = createSlice({
    name: "lists",
    initialState: null,
    reducers: {
        putTvShowList(state, action) {
            if(state == null) return { ...action.payload };
            state.tvShowList = action.payload.tvShowList;
        },
        putMovieList(state, action) {
            if (state == null) return { ...action.payload };
            state.movieList = action.payload.movieList;
        }
    }
});

export const {
    putTvShowList,
    putMovieList
} = ListsSlice.actions;
export default ListsSlice.reducer;