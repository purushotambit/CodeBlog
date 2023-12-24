import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

let UserRegister = () => {
  const navigate = useNavigate();

  let [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  let [userError, setUserError] = useState({
    nameError: "",
    emailError: "",
    passwordError: "",
  });

  let validateUsername = (event) => {
    setUser({ ...user, name: event.target.value });
    let regExp = /^[a-zA-Z0-9]/;
    !regExp.test(event.target.value)
      ? setUserError({ ...userError, nameError: "Enter a proper Username" })
      : setUserError({ ...userError, nameError: "" });
  };

  let validateEmail = (event) => {
    setUser({ ...user, email: event.target.value });
    let regExp = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;
    !regExp.test(event.target.value) || event.target.value.trim() == ""
      ? setUserError({ ...userError, emailError: "Enter a proper Email" })
      : setUserError({ ...userError, emailError: "" });
  };

  let validatePassword = (event) => {
    setUser({ ...user, password: event.target.value });
    if (event.target.value.trim() == "")
      setUserError({ ...userError, passwordError: "Enter a proper Password" });
    else setUserError({ ...userError, passwordError: "" });
  };

  let submitRegistration = async (event) => {
    event.preventDefault();

    // console.log(event);
    if (
      user.name.trim() !== "" &&
      user.email.trim() !== "" &&
      user.password.trim() !== ""
    ) {
      let name = user.name.trim();
      let email = user.email.trim();
      let password = user.password.trim();

      try {
        const response = await axios.post(
          "http://localhost:3000/api/users/register",
          { name, email, password },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        //  console.log(response);
        if (response.status === 200) {
          navigate("/login");
          Swal.fire("Registration successful", "", "success");
        } else if (response.status === 201) {
          Swal.fire("User already exists", "", "error");
          return;
        }
      } catch (error) {
        console.error("Registration failed:", error);

        Swal.fire("Registration failed", "", "error");
      }
    } else {
      Swal.fire("Oh no!", "Something went wrong! Try again", "error");
    }
  };

  return (
    <React.Fragment>
      <section className="p-3" style={{ fontFamily: "Roboto" }}>
        <div className="container">
          <div className="row animated zoomIn">
            <div className="col">
              <h2 className="h3 text-teal">
                <i className="fa fa-user-shield" /> Registration
              </h2>
              <h4>Welcome to Our Website</h4>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container">
          <div className="row animated zoomIn">
            <div className="col-md-6">
              <form onSubmit={submitRegistration}>
                <div className="form-group">
                  <input
                    required
                    name="name"
                    value={user.name}
                    onChange={validateUsername}
                    type="text"
                    className={`form-control mb-3 ${
                      userError.nameError.length > 0 ? "is-invalid" : ""
                    }`}
                    placeholder="Name"
                    style={{ height: "30px" }}
                  />
                  {userError.nameError.length > 0 ? (
                    <small className="text-danger">{userError.nameError}</small>
                  ) : (
                    ""
                  )}
                </div>
                <div className="form-group">
                  <input
                    required
                    name="email"
                    value={user.email}
                    onChange={validateEmail}
                    type="email"
                    className={`form-control mb-3 ${
                      userError.emailError.length > 0 ? "is-invalid" : ""
                    }`}
                    placeholder="Email"
                    style={{ height: "30px" }}
                  />
                  {userError.emailError.length > 0 ? (
                    <small className="text-danger">
                      {userError.emailError}
                    </small>
                  ) : (
                    ""
                  )}
                </div>
                <div className="form-group">
                  <input
                    required
                    name="password"
                    value={user.password}
                    onChange={validatePassword}
                    type="password"
                    className={`form-control mb-3 ${
                      userError.passwordError.length > 0 ? "is-invalid" : ""
                    }`}
                    placeholder="Password"
                    style={{ height: "30px" }}
                  />
                  {userError.passwordError.length > 0 ? (
                    <small className="text-danger">
                      {userError.passwordError}
                    </small>
                  ) : (
                    ""
                  )}
                </div>
                <div>
                  <input
                    type="submit"
                    className="btn btn-primary btn-sm h-auto w-25"
                    value="Register"
                    style={{
                      marginTop: "5px",
                      fontFamily: "Roboto",
                      fontSize: "1.1rem",
                      marginBottom: "5px",
                    }}
                  />
                </div>
              </form>
              <small style={{ fontSize: "1.1rem" }}>
                Already have an account ?
                <Link to="/login" className="font-weight-bold text-teal">
                  {" "}
                  Login
                </Link>
              </small>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};
export default UserRegister;
