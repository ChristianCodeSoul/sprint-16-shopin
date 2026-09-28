"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    useGetProfileQuery,
    useUpdateProfileMutation,
} from "@/store/api/api";
import { logout } from "@/store/slices/authSlice";

export default function ProfileModal({ onClose }) {
    const dispatch = useDispatch();
    const authUser = useSelector((state) => state.auth.user);

    const { data, isLoading, isError } = useGetProfileQuery();
    const [updateProfile, { isLoading: isUpdating }] =
        useUpdateProfileMutation();

    const [editing, setEditing] = useState(false);
    const [logoutConfirm, setLogoutConfirm] = useState(false);
    const [message, setMessage] = useState("");

    const user = data?.data?.user || authUser;
    const orders = data?.data?.orders || [];

    const [form, setForm] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        username: user?.username || "",
        email: user?.email || "",
        profileImage: user?.profileImage || "",
    });

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const handleUpdate = async (event) => {
        event.preventDefault();

        try {
            setMessage("");
            await updateProfile(form).unwrap();
            setEditing(false);
            setMessage("Profile updated.");
        } catch (error) {
            setMessage(error?.data?.message || "Unable to update profile.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("shopin-auth");
        dispatch(logout());
        onClose();
    };

    const startEditing = () => {
        setForm({
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            username: user?.username || "",
            email: user?.email || "",
            profileImage: user?.profileImage || "",
        });
        setEditing(true);
    };

    if (isLoading) {
        return (
            <div className="modal-overlay">
                <div className="profile-modal">
                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                    >
                        ×
                    </button>
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    if (isError && !authUser) {
        return (
            <div className="modal-overlay">
                <div className="profile-modal">
                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                    >
                        ×
                    </button>
                    <h2>Profile</h2>
                    <p>Unable to load your profile.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay">
            <div className="profile-modal">
                <button
                    type="button"
                    className="modal-close"
                    onClick={onClose}
                >
                    ×
                </button>

                <div className="profile-header">
                    <div className="profile-avatar">
                        {user?.firstName?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div>
                        <h2>{user?.firstName} {user?.lastName}</h2>
                        <p>@{user?.username}</p>
                    </div>
                </div>

                {message && <div className="profile-message">{message}</div>}

                {editing ? (
                    <form onSubmit={handleUpdate} className="profile-form">
                        <div className="profile-row">
                            <label>
                                First Name
                                <input
                                    name="firstName"
                                    value={form.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </label>

                            <label>
                                Last Name
                                <input
                                    name="lastName"
                                    value={form.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                        </div>

                        <label>
                            Username
                            <input
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label>
                            Email
                            <input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <div className="profile-actions">
                            <button type="submit" disabled={isUpdating}>
                                {isUpdating ? "Saving..." : "Save Changes"}
                            </button>

                            <button
                                type="button"
                                onClick={() => setEditing(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        <section className="profile-section">
                            <div className="profile-section-heading">
                                <h3>Personal Details</h3>
                                <button type="button" onClick={startEditing}>
                                    Edit
                                </button>
                            </div>

                            <div className="profile-details">
                                <div>
                                    <span>First Name</span>
                                    <strong>{user?.firstName}</strong>
                                </div>

                                <div>
                                    <span>Last Name</span>
                                    <strong>{user?.lastName}</strong>
                                </div>

                                <div>
                                    <span>Username</span>
                                    <strong>@{user?.username}</strong>
                                </div>

                                <div>
                                    <span>Email</span>
                                    <strong>{user?.email}</strong>
                                </div>

                                <div>
                                    <span>Registered</span>
                                    <strong>
                                        {user?.createdAt
                                            ? new Date(user.createdAt).toLocaleDateString()
                                            : "—"}
                                    </strong>
                                </div>
                            </div>
                        </section>

                        <section className="profile-section">
                            <h3>Shopping History</h3>

                            {orders.length === 0 ? (
                                <p className="profile-empty">No orders yet.</p>
                            ) : (
                                <div className="order-history">
                                    {orders.map((order) => (
                                        <div className="order-card" key={order._id}>
                                            <div>
                                                <strong>
                                                    Order #{order._id.slice(-6).toUpperCase()}
                                                </strong>
                                                <span>
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>

                                            <div>
                                                <strong>₹{order.totalAmount}</strong>
                                                <span>{order.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        <section className="profile-section">
                            <h3>Account</h3>

                            <button
                                type="button"
                                className="logout-button"
                                onClick={() => setLogoutConfirm(true)}
                            >
                                Logout
                            </button>
                        </section>
                    </>
                )}

                {logoutConfirm && (
                    <div className="logout-confirm">
                        <div className="logout-card">
                            <h3>Logout?</h3>
                            <p>Are you sure you want to logout?</p>

                            <div className="profile-actions">
                                <button type="button" onClick={handleLogout}>
                                    Yes, Logout
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setLogoutConfirm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}