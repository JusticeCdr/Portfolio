import React from "react";
import "./App.css";
import Header from "./components/header/header";
import Home from "./components/Home/Home";
import About from "./components/about/About";
import Skill from "./components/skills/Skill";
import Services from "./components/services/Services";
import Qualification from "./components/qualification/Qualification";
import Testimonials from "./components/testimonials/Testimonials";
import Contact from "./components/contact/Contact";

const App = () => {
  return (
    <>
      <Header />
      <main className="main">
        <Home />
        <About />
        <Skill />
        <Services />
        <Qualification />
        <Testimonials />
        <Contact />
      </main>
    </>
  );
};

export default App;
