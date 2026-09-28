"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice";

export default function AuthModal({ mode, onClose, onSuccess }) {
    const dispatch = useDispatch();
    const [currentMode, setCurrentMode] = useState(mode);
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const isRegister = currentMode === "register";

    const handleChange = (event) => {
        setForm((previous) => ({
            ...previous,
            [event.target.name]: event.target.value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (isRegister) {
            if (!form.firstName || !form.lastName || !form.username || !form.email || !form.password) {
                setError("Please fill in all fields.");
                return;
            }

            if (form.password.length < 8) {
                setError("Password must be at least 8 characters.");
                return;
            }
        } else if (!form.username || !form.password) {
            setError("Username and password are required.");
            return;
        }

        setLoading(true);

        try {
            const endpoint = isRegister ? "/auth/register" : "/auth/login";
            const body = isRegister
                ? {
                    firstName: form.firstName,
                    lastName: form.lastName,
                    username: form.username,
                    email: form.email,
                    password: form.password,
                }
                : {
                    username: form.username,
                    password: form.password,
                };

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Something went wrong.");
            }

            if (isRegister) {
                setSuccess(true);
                return;
            }

            const authData = {
                user: result.data?.user || result.user,
                token: result.data?.token || result.token,
            };

            dispatch(setCredentials(authData));
            localStorage.setItem("shopin-auth", JSON.stringify(authData));
            onSuccess?.();
            onClose();
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const switchMode = () => {
        setError("");
        setSuccess(false);
        setCurrentMode(isRegister ? "login" : "register");
    };

    if (success) {
        return (
            <div className="modal-backdrop">
                <div className="modal-card auth-card">
                    <button className="modal-close" type="button" onClick={onClose}>
                        ×
                    </button>

                    <div className="success-icon">✓</div>
                    <h2>You are registered successfully.</h2>
                    <p>Login to view your profile and shop.</p>

                    <button
                        className="auth-submit"
                        type="button"
                        onClick={() => {
                            setSuccess(false);
                            setCurrentMode("login");
                            setForm({
                                firstName: "",
                                lastName: "",
                                username: form.username,
                                email: "",
                                password: "",
                            });
                        }}
                    >
                        Proceed to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-backdrop">
            <div className="modal-card auth-card">
                <button className="modal-close" type="button" onClick={onClose}>
                    ×
                </button>

                <p className="section-label">
                    {isRegister ? "JOIN SHOPIN" : "WELCOME BACK"}
                </p>

                <h2>
                    {isRegister ? "Create your account." : "Login to ShopIn."}
                </h2>

                <p className="auth-description">
                    {isRegister
                        ? "Create an account to save your cart and shopping history."
                        : "Login to access your profile, cart and orders."}
                </p>

                <form onSubmit={handleSubmit}>
                    {isRegister && (
                        <>
                            <div className="form-row">
                                <label>
                                    First name
                                    <input
                                        name="firstName"
                                        value={form.firstName}
                                        onChange={handleChange}
                                        placeholder="First name"
                                    />
                                </label>

                                <label>
                                    Last name
                                    <input
                                        name="lastName"
                                        value={form.lastName}
                                        onChange={handleChange}
                                        placeholder="Last name"
                                    />
                                </label>
                            </div>

                            <label>
                                Email
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                />
                            </label>
                        </>
                    )}

                    <label>
                        Username
                        <input
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            placeholder="Username"
                            autoComplete="username"
                        />
                    </label>

                    <label>
                        Password
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Password"
                                autoComplete={isRegister ? "new-password" : "current-password"}
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword((value) => !value)}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </label>

                    {error && <div className="form-error">{error}</div>}

                    <button className="auth-submit" type="submit" disabled={loading}>
                        {loading
                            ? "Please wait..."
                            : isRegister
                                ? "Create Account"
                                : "Login"}
                    </button>
                </form>

                <div className="auth-switch">
                    {isRegister
                        ? "Already have an account?"
                        : "Don't have an account?"}

                    <button type="button" onClick={switchMode}>
                        {isRegister ? "Login" : "Register"}
                    </button>
                </div>
            </div>
        </div>
    );
}