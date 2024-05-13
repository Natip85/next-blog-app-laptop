import { logout } from "@/actions/logout";
// import { signOut } from "next-auth/react";
import React from "react";

interface LogoutButtonProps {
  children?: React.ReactNode;
}

const LogoutButton = ({ children }: LogoutButtonProps) => {
  const onClick = () => {
    localStorage.removeItem("edit-document");
    logout();
    // signOut()
  };
  return (
    <span onClick={onClick} className="cursor-pointer w-full">
      {children}
    </span>
  );
};

export default LogoutButton;
