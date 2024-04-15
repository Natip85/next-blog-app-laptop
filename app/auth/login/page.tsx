import LoginForm from "@/components/auth/LoginForm";
import { Suspense } from "react";
import { BeatLoader } from "react-spinners";

const LoginPage = () => {
  return (
    <Suspense
      fallback={
        <div>
          <BeatLoader />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
};

export default LoginPage;
