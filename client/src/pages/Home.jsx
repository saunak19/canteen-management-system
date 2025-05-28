import React, { useState, useEffect } from "react";
import Logout from "../components/Logout";
import Navbar from "../components/Navbar";


const Home = () => {
  const [loggedInUser, setLoggedUser] = useState("");
  useEffect(() => {
    setLoggedUser(localStorage.getItem("user"));
  }, []);
  return (
    <>
      <Navbar/>
    </>
  );
};

export default Home;
