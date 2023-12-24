import React from "react";
import { Link, useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();
  let clickLogOut = async () => {
    localStorage.removeItem("comment_system");
    navigate("/login");
  };

  let beforeLogin = (
    <React.Fragment>
      <li className="nav-item">
        <Link
          to="/register"
          className="nav-link mt-2 "
          style={{ fontSize: "1.2rem", color: "white", fontFamily: "Roboto" }}
        >
          Register
        </Link>
      </li>
      <li className="nav-item">
        <Link
          to="/login"
          className="nav-link mt-2 "
          style={{ fontSize: "1.2rem", color: "white", fontFamily: "Roboto" }}
        >
          Login
        </Link>
      </li>
    </React.Fragment>
  );

  let afterLogin = (
    <React.Fragment>
      <li className="nav-item ">
        <Link
          to="/"
          className="nav-link mt-2"
          onClick={clickLogOut}
          style={{ fontSize: "1.2rem", color: "white", fontFamily: "Roboto" }}
        >
          LogOut
        </Link>
      </li>
    </React.Fragment>
  );

  return (
    <>
      <nav
        class="navbar navbar-expand-lg navbar-dark  sticky-top"
        style={{ backgroundColor: "#110f24" }}
      >
        <div class="container-fluid">
          <Link
            class="navbar-brand mt-1"
            to="/"
            style={{
              fontSize: "1.6rem",
              marginLeft: "15px",
              fontFamily: "roboto",
            }}
          >
            Comment
          </Link>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <ul className="navbar-nav ml-auto">
                {localStorage.getItem("comment_system")
                  ? afterLogin
                  : beforeLogin}
              </ul>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
