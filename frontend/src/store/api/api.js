import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,

    prepareHeaders: (headers, { getState }) => {
        let token = getState().auth?.token;

        if (!token && typeof window !== "undefined") {
            try {
                const savedAuth = localStorage.getItem("shopin-auth");

                if (savedAuth) {
                    const authData = JSON.parse(savedAuth);
                    token = authData?.token;
                }
            } catch {
                localStorage.removeItem("shopin-auth");
            }
        }

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }

        headers.set("Content-Type", "application/json");

        return headers;
    },
});

export const api = createApi({
    reducerPath: "api",
    baseQuery,
    tagTypes: ["Product", "Cart", "Profile", "Order", "Admin"],

    endpoints: (builder) => ({
        // PRODUCTS
        getProducts: builder.query({
            query: () => "/products",
            providesTags: ["Product"],
        }),

        getProduct: builder.query({
            query: (id) => `/products/${id}`,
            providesTags: (result, error, id) => [
                { type: "Product", id },
            ],
        }),

        createProduct: builder.mutation({
            query: (body) => ({
                url: "/products",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Product"],
        }),

        updateProduct: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/products/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Product"],
        }),

        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/products/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Product"],
        }),

        // CART
        getCart: builder.query({
            query: () => "/cart",
            providesTags: ["Cart"],
        }),

        createCartItem: builder.mutation({
            query: ({ productId, quantity = 1 }) => ({
                url: "/cart/items",
                method: "POST",
                body: { productId, quantity },
            }),
            invalidatesTags: ["Cart"],
        }),

        updateCartItem: builder.mutation({
            query: ({ productId, quantity }) => ({
                url: `/cart/items/${productId}`,
                method: "PUT",
                body: { quantity },
            }),
            invalidatesTags: ["Cart"],
        }),

        removeCartItem: builder.mutation({
            query: (productId) => ({
                url: `/cart/items/${productId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Cart"],
        }),

        clearCart: builder.mutation({
            query: () => ({
                url: "/cart",
                method: "DELETE",
            }),
            invalidatesTags: ["Cart"],
        }),

        // ORDERS
        getOrders: builder.query({
            query: () => "/orders",
            providesTags: ["Order"],
        }),

        createOrder: builder.mutation({
            query: () => ({
                url: "/orders",
                method: "POST",
            }),
            invalidatesTags: ["Cart", "Order"],
        }),

        // ADMIN
        getAdminStats: builder.query({
            query: () => "/admin/stats",
            providesTags: ["Admin"],
        }),

        getAdminUsers: builder.query({
            query: () => "/admin/users",
            providesTags: ["Admin"],
        }),

        getAdminOrders: builder.query({
            query: () => "/admin/orders",
            providesTags: ["Admin"],
        }),

        generateProductDescription: builder.mutation({
            query: (body) => ({
                url: "/admin/ai/product-description",
                method: "POST",
                body,
            }),
        }),

        // PROFILE
        getProfile: builder.query({
            query: () => "/users/profile",
            providesTags: ["Profile"],
        }),

        updateProfile: builder.mutation({
            query: (profile) => ({
                url: "/users/profile",
                method: "PUT",
                body: profile,
            }),
            invalidatesTags: ["Profile"],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductQuery,
    useGetCartQuery,
    useCreateCartItemMutation,
    useUpdateCartItemMutation,
    useRemoveCartItemMutation,
    useClearCartMutation,
    useGetOrdersQuery,
    useCreateOrderMutation,
    useGetProfileQuery,
    useUpdateProfileMutation,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useGetAdminStatsQuery,
    useGetAdminUsersQuery,
    useGetAdminOrdersQuery,
    useGenerateProductDescriptionMutation,
} = api;