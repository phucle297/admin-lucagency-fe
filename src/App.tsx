import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "@templates/MainLayout";
import Contacts from "@pages/Contacts";
import Pricing from "@pages/Pricing";
import CreatePricing from "@pages/CreatePricing";
import EditPricing from "@pages/EditPricing";
import Login from "@pages/Login";
import Users from "@pages/Users";
import CreateUser from "@pages/CreateUser";
import Posts from "@pages/Posts";

function App() {
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

            <Route path="*" element={<div>Not found</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
