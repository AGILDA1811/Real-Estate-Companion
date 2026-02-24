import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/navbar";

import Home from "./pages/Home";
import Apartments from "./pages/Apartaments";
import About from "./pages/About";
import Contacts from "./pages/Contacts";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apartments" element={<Apartments />} />
        <Route path="/about" element={<About />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/help" element={<Help />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}