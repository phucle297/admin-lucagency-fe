/* eslint-disable react-hooks/exhaustive-deps */
import Contacts from "@pages/Contacts";
import CreatePost from "@pages/CreatePost";
import CreatePricing from "@pages/CreatePricing";
import CreateUser from "@pages/CreateUser";
import EditPost from "@pages/EditPost";
import EditPricing from "@pages/EditPricing";
import Login from "@pages/Login";
import Posts from "@pages/Posts";
import Pricing from "@pages/Pricing";
import Users from "@pages/Users";
import { useGlobalStore } from "@stores/globalStore";
import MainLayout from "@templates/MainLayout";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes, redirect } from "react-router-dom";

function App() {
  const getWhoAmI = useGlobalStore((state) => state.getWhoAmI);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      redirect("/login");
    } else {
      getWhoAmI().catch(console.log);
      redirect("/posts");
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

            <Route path="*" element={<div>Not found</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
