"use client";

import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "./store";
import { setCredentials, setHydrated } from "./slices/authSlice";

function AuthHydration({ children }) {
    const dispatch = useDispatch();

    useEffect(() => {
        const savedAuth = localStorage.getItem("shopin-auth");

        if (savedAuth) {
            try {
                dispatch(setCredentials(JSON.parse(savedAuth)));
            } catch {
                localStorage.removeItem("shopin-auth");
            }
        }

        dispatch(setHydrated());
    }, [dispatch]);

    return children;
}

export default function StoreProvider({ children }) {
    return (
        <Provider store={store}>
            <AuthHydration>{children}</AuthHydration>
        </Provider>
    );
}