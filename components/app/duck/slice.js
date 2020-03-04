import { createSlice } from "@reduxjs/toolkit";

const AppSlice = createSlice({
    name: "app",
    initialState: null,
    reducers: {
        putError(state, action) {
            if (state == null) return state = { ...action.payload };
            state.error = action.payload.error;
        },
        putUser(state, action) {
            if (state == null) return state = { ...action.payload };
            state.user = action.payload.user;
        }
    }
});

export const {
    putError,
    putUser
} = AppSlice.actions;
export default AppSlice.reducer;