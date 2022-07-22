import React from "react";
import userStore from "../stores/user.store";

const Title = () => {
  const currentUser = userStore((state: any) => state.user);
  return <h1>Hello there {currentUser ? currentUser?.name : ""}.</h1>;
};

export default Title;
