import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    hydrated: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },

        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        },

        setHydrated: (state) => {
            state.hydrated = true;
        },
    },
});

export const { setCredentials, logout, setHydrated } = authSlice.actions;

export default authSlice.reducer;