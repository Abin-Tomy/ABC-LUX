/* =============================================================
   main.tsx — Application Entry Point
   =============================================================
   Purpose   : Initializes the React application, configures the router, and mounts the root element to the DOM.
   Used by   : index.html
   Depends on: react, react-dom, react-router-dom
   Notes     : Configured to use React Router v7 and wraps the entire app in RootLayout.
   ============================================================= */

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RootLayout } from "./pages/__root";
import Index from "./pages/index";
import ProductDetail from "./pages/product-detail";
import AboutPage from "./pages/about";
import Blog from "./pages/blog";
import BlogPost from "./pages/blog-post";
import "./styles/styles.css";
import "./styles/responsive.css";
import NotFoundComponent from "./pages/not-found";

import BrandsPage from "./pages/brands";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Index /> },
      { path: "about", element: <AboutPage /> },
      { path: "brands", element: <BrandsPage /> },
      { path: "product/:id", element: <ProductDetail /> },
      { path: "blog", element: <Blog /> },
      { path: "blog/:slug", element: <BlogPost /> },
      { path: "*", element: <NotFoundComponent /> },
    ],
  },
]);

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  );
}
