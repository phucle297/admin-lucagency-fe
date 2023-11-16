/* eslint-disable react-hooks/exhaustive-deps */
import Contacts from "@pages/Contacts";
import CreatePost from "@pages/CreatePost";
import CreatePricing from "@pages/CreatePricing";
import CreateUser from "@pages/CreateUser";
import Customers from "@pages/Customers";
import EditPost from "@pages/EditPost";
import EditPricing from "@pages/EditPricing";
import Login from "@pages/Login";
import Posts from "@pages/Posts";
import Pricing from "@pages/Pricing";
import Users from "@pages/Users";
import { useGlobalStore } from "@stores/globalStore";
import MainLayout from "@templates/MainLayout";
import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

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

            <Route path="/" element={<Navigate to={path} />} />
            <Route path="*" element={<div>Not found</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
