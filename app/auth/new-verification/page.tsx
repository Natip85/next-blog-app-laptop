import NewVerificationForm from "@/components/auth/NewVerificationForm";
import { Suspense } from "react";
import { BeatLoader } from "react-spinners";

const NewVerificationPage = () => {
  return (
    <Suspense
      fallback={
        <div>
          <BeatLoader />
        </div>
      }
    >
      <NewVerificationForm />
    </Suspense>
  );
};

export default NewVerificationPage;
