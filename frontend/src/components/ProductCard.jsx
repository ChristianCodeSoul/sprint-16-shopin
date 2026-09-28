"use client";

import Image from "next/image";
import { useState } from "react";
import { useCreateCartItemMutation } from "@/store/api/api";

export default function ProductCard({ product, onLoginRequired }) {
    const [createCartItem, { isLoading }] = useCreateCartItemMutation();
    const [message, setMessage] = useState("");

    const handleAddToCart = async () => {
        try {
            setMessage("");

            await createCartItem({
                productId: product._id,
                quantity: 1,
            }).unwrap();

            setMessage("Added to cart");
        } catch (error) {
            if (error?.status === 401) {
                onLoginRequired();
                return;
            }

            setMessage(error?.data?.message || "Unable to add to cart");
        }
    };

    return (
        <article className="product-card">
            <div className="product-image">
                {product.image ? (
                    <Image
                        src={product.image}
                        alt={product.title}
                        width={500}
                        height={500}
                        unoptimized
                    />
                ) : (
                    <span>No image</span>
                )}
            </div>

            <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3>{product.title}</h3>
                <p>{product.description || "Everyday useful product."}</p>

                <div className="product-bottom">
                    <strong>₹{product.price}</strong>

                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={isLoading}
                    >
                        {isLoading ? "Adding..." : "Add to Cart"}
                    </button>
                </div>

                {message && <small>{message}</small>}
            </div>
        </article>
    );
}