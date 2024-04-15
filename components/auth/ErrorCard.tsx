import React from "react";
import AuthCardWrapper from "./AuthCardWrapper";
import { FaExclamationTriangle } from "react-icons/fa";

const ErrorCard = () => {
  return (
    <AuthCardWrapper
      headerLabel="Oops! Something went wrong"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="w-full items-center flex justify-center">
        <FaExclamationTriangle className="text-destructive" />
      </div>
    </AuthCardWrapper>
  );
};

export default ErrorCard;
