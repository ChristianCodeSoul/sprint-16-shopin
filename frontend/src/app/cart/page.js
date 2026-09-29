"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import Header from "@/components/Header";

import {
    useGetCartQuery,
    useUpdateCartItemMutation,
    useRemoveCartItemMutation,
    useClearCartMutation,
    useCreateOrderMutation,
} from "@/store/api/api";

export default function CartPage() {
    const router = useRouter();

    const isAuthenticated = useSelector(
        (state) => state.auth.isAuthenticated
    );

    const { data, isLoading, isError } = useGetCartQuery(
        undefined,
        {
            skip: !isAuthenticated,
        }
    );

    const [
        updateCartItem,
        { isLoading: isUpdating },
    ] = useUpdateCartItemMutation();

    const [
        removeCartItem,
        { isLoading: isRemoving },
    ] = useRemoveCartItemMutation();

    const [
        clearCart,
        { isLoading: isClearing },
    ] = useClearCartMutation();

    const [
        createOrder,
        { isLoading: isOrdering },
    ] = useCreateOrderMutation();

    const cartItems = data?.data?.items || [];

    const totalAmount = cartItems.reduce(
        (total, item) =>
            total +
            (item.product?.price || 0) * item.quantity,
        0
    );

    const handleQuantityChange = async (
        productId,
        quantity
    ) => {
        try {
            await updateCartItem({
                productId,
                quantity,
            }).unwrap();
        } catch (error) {
            alert(
                error?.data?.message ||
                "Failed to update cart"
            );
        }
    };

    const handleRemove = async (productId) => {
        try {
            await removeCartItem(productId).unwrap();
        } catch (error) {
            alert(
                error?.data?.message ||
                "Failed to remove item"
            );
        }
    };

    const handleClear = async () => {
        try {
            await clearCart().unwrap();
        } catch (error) {
            alert(
                error?.data?.message ||
                "Failed to clear cart"
            );
        }
    };

    const handleCheckout = async () => {
        try {
            await createOrder().unwrap();

            alert(
                "Order placed successfully — Demo"
            );
        } catch (error) {
            alert(
                error?.data?.message ||
                "Failed to place order"
            );
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="shopin-page">
                <Header
                    onProfile={() => router.push("/")}
                    onCart={() => router.push("/cart")}
                />

                <main className="cart-page">
                    <div className="cart-empty">
                        <p className="section-label">
                            CART
                        </p>

                        <h1>Login required</h1>

                        <p>
                            Please login to view your cart.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                router.push("/")
                            }
                        >
                            Go to Shop
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="shopin-page">
            <Header
                onProfile={() => router.push("/")}
                onCart={() => router.push("/cart")}
            />

            <main className="cart-page">
                <section className="cart-header">
                    <p className="section-label">
                        CART
                    </p>

                    <h1>Your Shopping Cart</h1>

                    <p>
                        Review your items and place your
                        order.
                    </p>
                </section>

                {isLoading && (
                    <div className="cart-status">
                        Loading your cart...
                    </div>
                )}

                {isError && (
                    <div className="cart-status error">
                        Unable to load your cart.
                    </div>
                )}

                {!isLoading &&
                    !isError &&
                    cartItems.length === 0 && (
                        <div className="cart-empty">
                            <h2>Your cart is empty</h2>

                            <p>
                                Add some products from the
                                shop to get started.
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    router.push(
                                        "/#products"
                                    )
                                }
                            >
                                Shop Now
                            </button>
                        </div>
                    )}

                {!isLoading &&
                    !isError &&
                    cartItems.length > 0 && (
                        <div className="cart-layout">
                            <section className="cart-items">
                                {cartItems.map((item) => {
                                    const product =
                                        item.product;

                                    if (!product) {
                                        return null;
                                    }

                                    return (
                                        <article
                                            className="cart-item"
                                            key={product._id}
                                        >
                                            <div className="cart-item-image">
                                                {product.image ? (
                                                    <Image
                                                        src={
                                                            product.image
                                                        }
                                                        alt={
                                                            product.title
                                                        }
                                                        width={500}
                                                        height={500}
                                                    />
                                                ) : (
                                                    <span>
                                                        No image
                                                    </span>
                                                )}
                                            </div>

                                            <div className="cart-item-info">
                                                <span className="product-category">
                                                    {
                                                        product.category
                                                    }
                                                </span>

                                                <h3>
                                                    {
                                                        product.title
                                                    }
                                                </h3>

                                                <strong>
                                                    ₹
                                                    {
                                                        product.price
                                                    }
                                                </strong>

                                                <div className="cart-item-actions">
                                                    <div className="quantity-control">
                                                        <button
                                                            type="button"
                                                            disabled={
                                                                item.quantity <=
                                                                1 ||
                                                                isUpdating
                                                            }
                                                            onClick={() =>
                                                                handleQuantityChange(
                                                                    product._id,
                                                                    item.quantity -
                                                                    1
                                                                )
                                                            }
                                                        >
                                                            −
                                                        </button>

                                                        <span>
                                                            {
                                                                item.quantity
                                                            }
                                                        </span>

                                                        <button
                                                            type="button"
                                                            disabled={
                                                                item.quantity >=
                                                                product.stock ||
                                                                isUpdating
                                                            }
                                                            onClick={() =>
                                                                handleQuantityChange(
                                                                    product._id,
                                                                    item.quantity +
                                                                    1
                                                                )
                                                            }
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        className="remove-button"
                                                        disabled={
                                                            isRemoving
                                                        }
                                                        onClick={() =>
                                                            handleRemove(
                                                                product._id
                                                            )
                                                        }
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>

                                            <strong className="cart-item-total">
                                                ₹
                                                {product.price *
                                                    item.quantity}
                                            </strong>
                                        </article>
                                    );
                                })}
                            </section>

                            <aside className="cart-summary">
                                <h2>Order Summary</h2>

                                <div className="summary-row">
                                    <span>Items</span>
                                    <span>
                                        {cartItems.length}
                                    </span>
                                </div>

                                <div className="summary-row">
                                    <span>Total</span>

                                    <strong>
                                        ₹{totalAmount}
                                    </strong>
                                </div>

                                <button
                                    type="button"
                                    className="checkout-button"
                                    disabled={isOrdering}
                                    onClick={
                                        handleCheckout
                                    }
                                >
                                    {isOrdering
                                        ? "Placing Order..."
                                        : "Place Order"}
                                </button>

                                <button
                                    type="button"
                                    className="clear-cart-button"
                                    disabled={isClearing}
                                    onClick={handleClear}
                                >
                                    {isClearing
                                        ? "Clearing..."
                                        : "Clear Cart"}
                                </button>

                                <button
                                    type="button"
                                    className="continue-shopping"
                                    onClick={() =>
                                        router.push(
                                            "/#products"
                                        )
                                    }
                                >
                                    Continue Shopping
                                </button>
                            </aside>
                        </div>
                    )}
            </main>
        </div>
    );
}