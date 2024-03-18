// import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";

import { RtcProvider } from "./context/RtcContext.tsx";
import { Home, Room } from "./pages";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <BrowserRouter>
    <RtcProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:id" element={<Room />} />
      </Routes>
    </RtcProvider>
  </BrowserRouter>
  // </React.StrictMode>
);
