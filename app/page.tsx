import { Nav, NavLink } from "@/components/nav/Nav";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen">
      <div className="backdrop-blur-lg sticky top-0 border-b-[1.5px] border-black">
        <Nav>
          <Link href={"/"} className="flex items-center gap-3">
            <div>
              <Image
                src={"/sound-waves.png"}
                alt="logo"
                width={60}
                height={60}
              />
            </div>
            <span className="hidden md:block md:text-3xl font-semibold font-mono">
              Yarcone
            </span>
          </Link>
          <div className="flex items-center">
            <div className="hidden sm:flex flex-row items-center">
              <NavLink href={"/"}>Our story</NavLink>
              <NavLink href={"/g"}>Membership</NavLink>
              <NavLink href={"/article/new"}>Write</NavLink>
            </div>
            <NavLink href={"/auth/login"}>Sign in</NavLink>

            <Button className="rounded-3xl" asChild>
              <Link href={"/auth/register"}>Get started</Link>
            </Button>
          </div>
        </Nav>
      </div>

      <section className="h-[90vh] bg-yellow-500 border-black border-b-[1.5px] -mt-[3rem]">
        <div className="container max-w-6xl h-full flex flex-col justify-center">
          <div className="flex flex-col justify-between gap-5 py-20">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl tracking-tighter">
              Human stories <br />
              and ideas
            </h1>
            <p className="text-lg sm:text-2xl max-w-[750px]">
              Discover perspectives that deepen understanding. Share insights on
              a simple, beautiful, collaborative writing platform.
            </p>

            <Button className="rounded-3xl text-white w-fit px-10" asChild>
              <Link href={"/feed"}>Start reading</Link>
            </Button>
          </div>
        </div>
      </section>
      <div className="flex items-center justify-center gap-3 p-4">
        <div className="text-sm text-muted-foreground">About</div>
        <div className="text-sm text-muted-foreground">Help</div>
        <div className="text-sm text-muted-foreground">Blog</div>
        <div className="text-sm text-muted-foreground">Careers</div>
        <div className="text-sm text-muted-foreground">Terms</div>
      </div>
    </div>
  );
}
