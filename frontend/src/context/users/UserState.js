import userContext from "./userContext";
import React, { useState, useEffect } from "react";
import axios from "axios";
const UserState = (props) => {
  const [User, setUser] = useState({
    id: null,
    username: "Purushotam",
  });

  const getUser = async () => {
    let token = localStorage.getItem("comment_system");

    try {
      const response = await axios.get("http://localhost:3000/api/users/user", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setUser({
          id: response.data.id,
          username: response.data.username,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (localStorage.getItem("comment_system")) {
      getUser();
    }
  }, []);
  return (
    <userContext.Provider value={{ User }}>
      {props.children}
    </userContext.Provider>
  );
};

export default UserState;
