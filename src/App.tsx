import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import BrowserRouter
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";
import PostDetails from "./components/PostDetails";

const App: React.FC = () => {
  return (
    <Router>
      {" "}
      {/* Wrap your entire app with BrowserRouter */}
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/posts" element={<PostDetails />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
