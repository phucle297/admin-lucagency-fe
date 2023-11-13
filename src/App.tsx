import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "@templates/MainLayout";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route path="contacts" element={<div>Contacts</div>} />
            <Route path="*" element={<div>Not found</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
