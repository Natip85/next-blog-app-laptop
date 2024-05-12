import Link from "next/link";
import React from "react";

interface AuthHeaderProps {
  label: string;
}

const AuthHeader = ({ label }: AuthHeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <h1 className="text-5xl font-semibold">
        <Link href={"/"}>🔐 Medium</Link>
      </h1>
      <p className="text-muted-foreground">{label}</p>
    </div>
  );
};

export default AuthHeader;
