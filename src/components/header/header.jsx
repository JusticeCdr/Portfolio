import React, { useState } from "react";
import "./header.css";

const Header = () => {
  const [Toggle, showMenu] = useState(false);
  return (
    <header className="header ">
      <nav className="nav container">
        <a className="nav__logo" href="index.html">
          Doston
        </a>

        <div className={Toggle ? "nav__menu show__menu" : "nav__menu"}>
          <ul className="nav__list grid">
            <li className="nav__item">
              <a className="nav__link active-link" href="#home">
                <i className="bx bx-home nav__icon"></i> Home
              </a>
            </li>

            <li className="nav__item">
              <a className="nav__link" href="#about">
                <i className="bx bxs-user nav__icon"></i> About
              </a>
            </li>

            <li className="nav__item">
              <a className="nav__link" href="#skills">
                <i className="bx bx-code-alt nav__icon"></i> Skills
              </a>
            </li>

            <li className="nav__item">
              <a className="nav__link" href="#services">
                <i className="bx bx-server nav__icon"></i> Services
              </a>
            </li>

            <li className="nav__item">
              <a className="nav__link" href="#portfolio">
                <i className="bx bxs-report nav__icon"></i> Portfolio
              </a>
            </li>

            <li className="nav__item">
              <a className="nav__link" href="#contact">
                <i className="bx bx-home nav__icon"></i> Contact
              </a>
            </li>
          </ul>
          <i class="bx bx-x nav__close" onClick={() => showMenu(!Toggle)}></i>
        </div>

        <div className="nav__toggle" onClick={() => showMenu(!Toggle)}>
          <i class="bx bx-grid-small"></i>
        </div>
      </nav>
    </header>
  );
};

export default Header;
