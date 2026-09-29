"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetCartQuery } from "@/store/api/api";

export default function Header({ onLogin, onProfile, onCart }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem("shopin-theme");
        const isDark = savedTheme === "dark";

        setDarkMode(isDark);
        document.documentElement.classList.toggle("dark", isDark);
    }, []);

    const toggleDarkMode = () => {
        setDarkMode((current) => {
            const nextMode = !current;

            document.documentElement.classList.toggle(
                "dark",
                nextMode
            );

            localStorage.setItem(
                "shopin-theme",
                nextMode ? "dark" : "light"
            );

            return nextMode;
        });
    };

    const { isAuthenticated, user } = useSelector(
        (state) => state.auth
    );

    const { data: cartData } = useGetCartQuery(undefined, {
        skip: !isAuthenticated,
    });

    const cartItems = cartData?.data?.items || [];

    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const closeMenu = () => setMenuOpen(false);

    const profileInitial =
        user?.firstName?.charAt(0)?.toUpperCase() || "U";

    return (
        <header className="site-header">
            <div className="header-inner">
                <Link href="/" className="logo">
                    ShopIn.
                </Link>

                <nav
                    className={`nav ${
                        menuOpen ? "nav-open" : ""
                    }`}
                >
                    <Link href="/" onClick={closeMenu}>
                        Home
                    </Link>

                    <a href="#products" onClick={closeMenu}>
                        Products
                    </a>

                    {isAuthenticated && user?.role === "admin" && (
                        <Link href="/admin" onClick={closeMenu}>
                            Admin
                        </Link>
                    )}

                    {!isAuthenticated && (
                        <Link href="/admin/login" onClick={closeMenu}>
                            Admin Login
                        </Link>
                    )}

                    <div className="header-account-actions">
                        <button
                            type="button"
                            className="theme-button"
                            onClick={() => {
                                toggleDarkMode();
                                closeMenu();
                            }}
                            aria-label={
                                darkMode
                                    ? "Switch to light mode"
                                    : "Switch to dark mode"
                            }
                        >
                            {darkMode ? "☀ Light" : "☾ Dark"}
                        </button>

                        <button
                            type="button"
                            className={
                                isAuthenticated
                                    ? "profile-trigger"
                                    : ""
                            }
                            onClick={() => {
                                onProfile();
                                closeMenu();
                            }}
                            aria-label="Open profile"
                        >
                            {isAuthenticated ? (
                                <span className="profile-circle">
                                    {profileInitial}
                                </span>
                            ) : (
                                "Profile"
                            )}
                        </button>
                    </div>

                    <button
                        type="button"
                        className="cart-button"
                        onClick={() => {
                            onCart();
                            closeMenu();
                        }}
                    >
                        <span>Cart</span>

                        {cartCount > 0 && (
                            <span className="cart-badge">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </nav>

                <button
                    type="button"
                    className="menu-button"
                    onClick={() =>
                        setMenuOpen((open) => !open)
                    }
                    aria-label="Toggle menu"
                >
                    ☰
                </button>
            </div>
        </header>
    );
}