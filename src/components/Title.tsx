import React from "react";
import userStore from "../stores/user.store";

const Header = () => {
  const currentUser = userStore((state: any) => state.user);
  return <h1>Hello there {currentUser ? currentUser?.name : ""}.</h1>;
};

export default Header;
