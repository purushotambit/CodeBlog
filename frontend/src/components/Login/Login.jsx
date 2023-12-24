import React, { useState ,useEffect,useContext} from "react";
import { Link,useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios"
import commentContext from "../../context/comment/commentContext";
let UserLogin = () => {
 const commentcontext=useContext(commentContext);
 const {fetchComment}=commentcontext;
  const navigate = useNavigate();
  let [user, setUser] = useState({
    email: "",
    password: "",
  });

  let [userError, setUserError] = useState({
    emailError: "",
    passwordError: "",
  });

  useEffect(()=>{
    if(localStorage.getItem("comment_system")){
      navigate("/");
    }
  },[])

  let validateEmail = (event) => {
    setUser({ ...user, email: event.target.value });
    let regExp = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;
    !regExp.test(event.target.value)
      ? setUserError({ ...userError, emailError: "Enter a proper Email" })
      : setUserError({ ...userError, emailError: "" });
  };

  let validatePassword = (event) => {
    setUser({ ...user, password: event.target.value });
    if (event.target.value.trim() == "")
      setUserError({ ...userError, passwordError: "Enter a proper Password" });
    else setUserError({ ...userError, passwordError: "" });
  };
  let submitLogin = async(event) => {
    event.preventDefault();
    if (user.email !== "" && user.password !== "") {
        let email=user.email;
        let password = user.password;
        try{
          const response = await axios.post(
            "http://localhost:3000/api/users/login",
             { email, password },
             {
               headers: {
                 "Content-Type": "application/json",
               },
             }
           );
            
          
          
          if (response.status==200){
            localStorage.setItem("comment_system", response.data);
          
             navigate("/");
             Swal.fire("Login successful","", "success");
            
          }else if(response.status==201){
        
            Swal.fire("User does't exists","", "error");
          
          } 
        }catch(error){
          console.error("Error creating comment:", error);
          Swal.fire("Oh no!", "Something went wrong! Try again", "error");
        }
        
      
    } else {
      Swal.fire("Oh no!", "Something went wrong! Try again", "error");
      return ;
    }
  };

  return (
    <React.Fragment>
      <div className="container">

        
      </div>
      <section className="p-3" style={{fontFamily:"Roboto" }}>
        <div className="container">
          <div className="row animated zoomIn">
            <div className="col">
              <h2 className="h3 text-teal">
                <i className="fa fa-sign-in-alt" /> Login
              </h2>
              <h4>Welcome to Our Website</h4>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container">
          <div className="row">
            <div className="col-md-6 animated zoomIn">
              <form onSubmit={submitLogin}>
                <div className="form-group">
                  <input
                    name="email"
                    required
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
                    name="password"
                    required
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
                <div className="">
                  <input
                    type="submit"
                    className="btn btn-primary btn-sm h-auto w-25"
                    value="Login"

                    style={{ height: "50px" ,marginBottom:"10px",marginTop:"10px"  ,fontSize:"1.2rem",fontFamily:"Roboto"}}
                  />
                </div>
              </form>
              <small style={{fontSize:'1.2rem'}}>
                Don't have an account ?
                <Link
                  to="/register"
                  className="font-weight-bold text-teal"
                >
                  {" "}
                  Register
                </Link>
              </small>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};
export default UserLogin;
