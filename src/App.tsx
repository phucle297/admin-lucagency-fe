/* eslint-disable react-hooks/exhaustive-deps */

import { useGlobalStore } from "@stores/globalStore";
import { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

const Invoice = lazy(() => import("@pages/Invoices"));
const Login = lazy(() => import("@pages/Login"));
const MainLayout = lazy(() => import("@templates/MainLayout"));
const Contacts = lazy(() => import("@pages/Contacts"));
const Pricing = lazy(() => import("@pages/Pricing"));
const CreatePricing = lazy(() => import("@pages/CreatePricing"));
const EditPricing = lazy(() => import("@pages/EditPricing"));
const Users = lazy(() => import("@pages/Users"));
const CreateUser = lazy(() => import("@pages/CreateUser"));
const Posts = lazy(() => import("@pages/Posts"));
const CreatePost = lazy(() => import("@pages/CreatePost"));
const EditPost = lazy(() => import("@pages/EditPost"));
const Customers = lazy(() => import("@pages/Customers"));
const CustomerDetail = lazy(() => import("@pages/CustomerDetail"));

function App() {
  const getWhoAmI = useGlobalStore((state) => state.getWhoAmI);
  const [path, setPath] = useState<string>("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (location.pathname === "/login") return;
    if (!token) {
      setPath("/login");
    } else {
      getWhoAmI().catch(console.log);
      setPath("/posts");
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<p> Loading...</p>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<MainLayout />}>
              <Route path="contacts" element={<Contacts />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="pricing/create" element={<CreatePricing />} />
              <Route path="pricing/edit/:id" element={<EditPricing />} />
              <Route path="users" element={<Users />} />
              <Route path="users/create" element={<CreateUser />} />
              <Route path="posts" element={<Posts />} />
              <Route path="posts/create" element={<CreatePost />} />
              <Route path="posts/edit/:id" element={<EditPost />} />
              <Route path="customers" element={<Customers />} />
              <Route path="customers/detail/:id" element={<CustomerDetail />} />
              <Route path="invoices" element={<Invoice />} />
              <Route path="/" element={<Navigate to={path} />} />
              <Route path="*" element={<div>Not found</div>} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
