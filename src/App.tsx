import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "@templates/MainLayout";
import Contacts from "@pages/Contacts";
import Pricing from "@pages/Pricing";
import CreatePricing from "@pages/CreatePricing";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route path="contacts" element={<Contacts />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="pricing/create" element={<CreatePricing />} />
            <Route path="pricing/edit/:id" element={<div>Edit</div>} />
            <Route path="*" element={<div>Not found</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
