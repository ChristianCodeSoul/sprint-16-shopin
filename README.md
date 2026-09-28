# ShopIn :  Sprint 16

ShopIn is a full-stack ecommerce application built with Next.js, Express, MongoDB, and Redux Toolkit.

For Sprint 16, the focus was on polishing the existing application and adding a small AI feature without changing the core ecommerce flow.

## What’s included

* Responsive ecommerce UI
* Login and registration
* Product listing and product management
* Shopping cart and orders
* Admin dashboard
* AI-generated product descriptions using Gemini
* Redux Toolkit and RTK Query
* Helmet security headers and Content Security Policy
* DOMPurify-based server-side input sanitization
* JWT authentication and role-based access
* Docker Compose with MongoDB, two backend instances, frontend, and NGINX

## Tech Stack

**Frontend:** Next.js, React, Redux Toolkit, RTK Query

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT

**Security:** Helmet, CSP, DOMPurify

**AI:** Google Gemini API

**Deployment:** Docker, NGINX, Vercel, Render

## Running locally

```bash
git clone <your-repository-url>
cd sprint-16-shopin
docker compose up --build
```

Open:

```text
http://localhost:8080
```

## AI Feature

Admins can enter a product name and category and generate a short product description using Gemini. The generated response is sanitized on the server before being returned.

This sprint focused on UI polish, the AI micro-feature, and application security while keeping the existing ShopIn ecommerce functionality intact.
