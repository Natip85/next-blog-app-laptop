import Image from "next/image";
import Link from "next/link";
import React from "react";

interface AuthHeaderProps {
  label: string;
}

const AuthHeader = ({ label }: AuthHeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <h1 className="text-5xl font-semibold">
        <Link href={"/"} className="flex items-center gap-3">
          <div>
            <Image src={"/sound-waves.png"} alt="logo" width={60} height={60} />
          </div>
          <span className="text-3xl font-semibold font-mono">Yarcone</span>
        </Link>
      </h1>
      <p className="text-muted-foreground">{label}</p>
    </div>
  );
};

export default AuthHeader;
