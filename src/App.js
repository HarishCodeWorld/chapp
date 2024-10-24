import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Home } from "./containers/home";
import Login from "./components/login";
import Signup from "./components/sign-up";
import ChatHoc from "./containers/chat";
import { SocketProvider } from "./socket-connection-hook";

const About = () => <h2>About Us</h2>;

const App = () => {
  return (
    <div>
      <Router>
        <div className="App">
          <Routes>
            <Route
              path="/"
              element={
                <SocketProvider>
                  <Home />
                </SocketProvider>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<Signup />} />
            <Route
              path="/chat"
              element={
                <SocketProvider>
                  <ChatHoc />
                </SocketProvider>
              }
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
