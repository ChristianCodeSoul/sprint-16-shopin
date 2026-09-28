"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Header from "@/components/Header";
import AuthModal from "@/components/AuthModal";
import ProductCard from "@/components/ProductCard";
import ProfileModal from "@/components/ProfileModal";
import { useGetProductsQuery } from "@/store/api/api";

export default function HomePage() {
  const [authMode, setAuthMode] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const { data, isLoading, isError, error } = useGetProductsQuery();

  const products = data?.data || [];

  const handleProfile = () => {
    if (!isAuthenticated) return setAuthMode("login");
    setProfileOpen(true);
  };

  const handleCart = () => {
    if (!isAuthenticated) return setAuthMode("login");
    router.push("/cart");
  };

  return (
    <div className="shopin-page">
      <Header
        onLogin={() => setAuthMode("login")}
        onProfile={handleProfile}
        onCart={handleCart}
      />

      <main>
        {/* hero section */}
        <section className="hero">
          <p className="hero-label">
            EVERYDAY FINDS
          </p>

          <h1>Welcome to ShopIn.</h1>

          <p className="hero-text">
            Discover simple, useful products made for
            everyday life.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              onClick={() => setAuthMode("login")}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => setAuthMode("register")}
            >
              Register
            </button>
          </div>
        </section>

        {/* products */}
        <section
          id="products"
          className="products-section"
        >
          <p className="section-label">
            SHOP
          </p>

          <h2>Featured Products</h2>

          <p>
            Browse our current collection and add
            anything you like to your cart.
          </p>

          {isLoading && <div className="products-status">Loading...</div>}

          {isError && (
            <div className="products-status error">
              {error?.data?.message ||
                "Unable to load products."}
            </div>
          )}

          {!isLoading &&
            !isError &&
            products.length === 0 && (
              <div className="products-status">
                No products found.
              </div>
            )}

          {!isLoading &&
            !isError &&
            products.length > 0 && (
              <div className="products-grid">
                {products.map((p) => (
                  <ProductCard
                    key={p._id}
                    product={p}
                    onLoginRequired={() =>
                      setAuthMode("login")
                    }
                  />
                ))}
              </div>
            )}
        </section>

        {/* contact */}
        <section
          id="contact"
          className="contact-section"
        >
          <p className="section-label">
            CONTACT
          </p>

          <h2>Contact Us</h2>

          <p>
            Have a question or need help? Reach out
            through any of the demo channels below.
          </p>

          <div className="contact-links">
            <a href="#contact">LinkedIn</a>
            <a href="#contact">WhatsApp</a>
            <a href="#contact">Twitter</a>
          </div>
        </section>
      </main>

      {/* footer/socials */}
      <footer className="site-footer">
        <strong>ShopIn.</strong>

        <div>
          <Link href="/">Home</Link>
          <a href="#products">Products</a>
          <a href="#contact">Contact Us</a>
          <a href="#">Go Back Up</a>
        </div>
      </footer>

      {/* auth */}
      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onSuccess={() => setAuthMode(null)}
        />
      )}

      {/* profile */}
      {profileOpen && (
        <ProfileModal
          onClose={() => setProfileOpen(false)}
        />
      )}
    </div>
  );
}